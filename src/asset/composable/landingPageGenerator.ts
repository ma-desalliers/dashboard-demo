import { ref } from 'vue'
import section1 from '@/src/asset/html/section1'
import faqSection from '@/src/asset/html/faqSection'
import faqBlock from '@/src/asset/html/faqBlock'

interface SectionMetadata {
  link: string
  image: string
}

interface FAQ {
  question: string
  answer: string
}

interface GeneratorConfig {
  buttonLink: string
  mainColor: string
}

export function useHtmlGenerator() {
  const processedHtml: Ref<string> = ref('')
  const faqs: Ref<FAQ[]> = ref([])

  const minifyHTML = (html: string): string => {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--.*?-->/g, '')
      .replace(/\s+>/g, '>')
      .replace(/>\s+/g, '>')
      .replace(/\s+\/>/g, '/>')
      .trim()
  }

  const processLine = (line: string): string => {
    return line
      .replace(/<p>/g, '<p class="paragraph c-secondary">')
      .replace(/<strong>/g, '<strong class="fw-bold">')
      .replace(/<\/strong>/g, '</strong>&nbsp;')
      .replace(/<\/as>/g, '</as>&nbsp;')
      .replace(/<h3>/g, '<h3 class="c-white fw-bold">')
      .replace(/<ul>/g, '<ul class="list c-secondary">')
      .replace(/<ol>/g, '<ul class="list c-secondary">')
      .replace(/<li>/g, '<li class="list-item">')
  }

  const setSectionContent = (sectionLines: string, title: string, index: number) => {
    let sectionLink = ''
    let sectionimg = ''
    let sectionContent = ''
    let hasContent = false
    
    const lines = sectionLines.match(/<(h3|p|a|img|strong|ul|ol|li)[^>]*>[\s\S]*?<\/\1>|<(img|br)[^>]*>/g) || []
    
    for (const line of lines) {
      if (line.startsWith('<a')) {
        const linkMatch = line.match(/href="([^"]*)"/);
        sectionLink = linkMatch?.[1] || '';
        continue;
      }
      if (line.startsWith('<img')) {
        const imgMatch = line.match(/src="([^"]*)"/);
        sectionimg = imgMatch?.[1] || '';
        continue;
      }
      
      sectionContent += processLine(line)
      hasContent = true
    }
    
    return {
      content: sectionContent,
      hasContent,
      metadata: {
        link: sectionLink,
        image: sectionimg
      }
    }
  }

  const setSectionTemplate = (
    content: string,
    title: string,
    metadata: SectionMetadata,
    visibleIndex: number,
    index: number,
    config: GeneratorConfig
  ): string => {
    const isEven = visibleIndex % 2 === 0
    
    let processedSection = section1
      .replace('{{title}}', title)
      .replaceAll('{{titleH}}', index === 0 ? '1' : '2')
      .replace('{{sectionContent}}', content)
      .replace('{{button}}', `<a target="_blank" href="${metadata.link || config.buttonLink}" class="btn btn-primary br-xxs">Get In Touch</a>`)
      .replace('{{img}}', metadata.image)
    
    if (!isEven) {
      processedSection = processedSection
        .replace('section-3', 'section-3-reverse')
        .replaceAll('c-white', '')
    }
    
    return processedSection
  }

  const processFaqGroup = (h2Title: string, html: string) => {
    const hasH3 = /<h3/i.test(html)
    
    if (!hasH3) {
      faqs.value.push({
        question: h2Title,
        answer: processLine(html.trim())
      })
      return
    }

    const h3Pattern = /<h3[^>]*>.*?<\/h3>.*?(?=<h3|$)/gis
    const h3Matches = Array.from(html.matchAll(h3Pattern))

    if (h3Matches.length === 0) {
      faqs.value.push({
        question: h2Title,
        answer: processLine(html.trim())
      })
      return
    }

    // Process first H3 section as answer to H2 question
    const firstH3Section = h3Matches[0][0]
    const firstH3TitleMatch = firstH3Section.match(/<h3[^>]*>(.*?)<\/h3>/s)
    const firstH3Content = firstH3Section.replace(firstH3TitleMatch?.[0] || '', '')

    faqs.value.push({
      question: h2Title,
      answer: processLine(firstH3Content.trim())
    })

    // Process remaining H3s as separate FAQs
    for (let i = 1; i < h3Matches.length; i++) {
      const section = h3Matches[i][0]
      const titleMatch = section.match(/<h3[^>]*>(.*?)<\/h3>/s)
      const question = titleMatch?.[1] || ''
      const answer = section.replace(titleMatch?.[0] || '', '')

      faqs.value.push({
        question,
        answer: processLine(answer.trim())
      })
    }
  }

  const processSection = (html: string, index: number, visibleIndex: number, config: GeneratorConfig) => {
    const htmlWithoutP = html.replace(/<p>.*?<\/p>/gs, '')
    const htmlWithoutImg = htmlWithoutP.replace(/<img.*?>/gs, '')
    
    const tagPattern = index === 0 
      ? /<h1[^>]*>(.*?)<\/h1>/s 
      : /<h2[^>]*>(.*?)<\/h2>/s
    
    const match = htmlWithoutImg.match(tagPattern)
    const title = match?.[1] || ''
    const cleanHtml = html.replace(match?.[0] || '', '')
    
    const isH2Question = index > 0 && title.includes('?')
    const h3Count = (cleanHtml.match(/<h3/gi) || []).length
    
    if (isH2Question && h3Count > 0) {
      processFaqGroup(title, cleanHtml)
      return ''
    }
    
    const sectionResult = setSectionContent(cleanHtml, title, index)
    if (!sectionResult.hasContent) {
      return ''
    }
    
    return setSectionTemplate(
      sectionResult.content,
      title,
      sectionResult.metadata,
      visibleIndex,
      index,
      config
    )
  }

  const handleFaqs = () => {
    const blocks = faqs.value.map((faq, index) => {
      const section = faqBlock
        .replace('{{blockTitle}}', faq.question)
        .replace('{{sectionContent}}', faq.answer)
      
      if (index > 3) return section.replace('class="cc-block"', 'class="cc-block hidden"')
      return section
    }).join('')
    
    const fullSection = faqSection
      .replace('{{title}}', 'FAQ')
      .replace('{{sectionBlocks}}', blocks)
    
    if (faqs.value.length < 3) {
      return fullSection.replace(
        '<div class="cc-show_more">',
        '<div class="cc-show_more" style="display:none">'
      )
    }
    return fullSection
  }

  const generateHtml = (htmlContent: string, config: GeneratorConfig): string => {
    if (!htmlContent) {
      processedHtml.value = ''
      return ''
    }

    faqs.value = []
    
    const sections = htmlContent.split(/<h2/i)
    let visibleSectionCount = 0
    
    const result = sections.map((section, index) => {
      const processedSection = processSection(
        `${index > 0 ? '<h2' : ''}${section}`,
        index,
        visibleSectionCount,
        config
      )
      if (processedSection) visibleSectionCount++
      return processedSection || ''
    }).join('')
    
    let faqHtml = ''
    if (faqs.value.length > 0) {
      faqHtml = handleFaqs()
    }
    
    const finalHtml = minifyHTML(
      `<div class="c-scroll" id="cameleon-landing-page" style="--primary-color:${config.mainColor}">
        ${result}${faqHtml}
      </div>`
    )

    processedHtml.value = finalHtml
    return finalHtml
  }

  // Return the composable's public API
  return {
    generateHtml,
    processedHtml,
    faqs
  }
}