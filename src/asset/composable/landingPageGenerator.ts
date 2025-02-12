import { ref } from 'vue'
import section1 from '@/src/asset/html/section1'
import faqSection from '@/src/asset/html/faqSection'
import faqBlock from '@/src/asset/html/faqBlock'

interface Section {
  uuid: string
  pageUuid: string
  type: string
  index: number
  elements: Element[]
  createdAt: number
}

interface Element {
  uuid: string
  pageUuid: string
  sectionUuid: string
  index: number
  type: string
  data: any
  createdAt: number
}

interface GeneratorConfig {
  buttonLink: string
  mainColor: string
}

export function useHtmlGenerator() {
  const processedHtml = ref('')
  const faqs = ref<{ question: string; answer: string }[]>([])

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

  const processFaqElements = (elements: Element[]) => {
    elements.forEach((element) => {
      if (element.type === 'faq') {
        faqs.value.push({
          question: element.data.question || '',
          answer: processLine(element.data.answer || '')
        })
      }
    })
  }

  const processHeroSection = (elements: Element[]): { title: string; subtitle: string; content: string } => {
    let title = ''
    let subtitle = ''
    let content = ''
  
    elements.forEach((element) => {
      switch (element.type) {
        case 'h1':
          title = element.data.content || ''
          break
        case 'h2':
          subtitle = element.data.content || ''
          break
        case 'p':
          content = processLine(element.data.content || '')
          break
      }
    })
  
    return { title, subtitle, content }
  }

  const processTextSection = (elements: Element[]): { title: string; content: string } => {
    let title = ''
    let content = ''
  
    elements.forEach((element) => {
      switch (element.type) {
        case 'h2':
          title = element.data.content || ''
          break
        case 'p':
          content += processLine(element.data.content || '')
          break
      }
    })
  
    return { title, content }
  }

  const setSectionTemplate = (
    sectionData: { title: string; content: string },
    visibleIndex: number,
    isHero: boolean,
    config: GeneratorConfig
  ): string => {
    const isEven = visibleIndex % 2 === 0

    let processedSection = section1
      .replace('{{title}}', sectionData.title)
      .replaceAll('{{titleH}}', isHero ? '1' : '2')
      .replace('{{sectionContent}}', sectionData.content)
      .replace('{{button}}', `<a target="_blank" href="${config.buttonLink}" class="btn btn-primary br-xxs">Get In Touch</a>`)
      .replace('{{img}}', '')

    if (!isEven) {
      processedSection = processedSection
        .replace('section-3', 'section-3-reverse')
        .replaceAll('c-white', '')
    }

    return processedSection
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

  const generateHtml = (sections: Section[], config: GeneratorConfig): string => {
    console.log(sections)
    if (!sections.length) {
      processedHtml.value = ''
      return ''
    }

    faqs.value = []
    let visibleSectionCount = 0
    let result = ''

    // Sort sections by index
    const sortedSections = [...sections].sort((a, b) => a.index - b.index)

    sortedSections.forEach((section) => {
      switch (section.type) {
        case 'hero': {
          const heroData = processHeroSection(section.elements)
          result += setSectionTemplate(heroData, visibleSectionCount, true, config)
          visibleSectionCount++
          break
        }
        case 'text': {
          const textData = processTextSection(section.elements)
          result += setSectionTemplate(textData, visibleSectionCount, false, config)
          visibleSectionCount++
          break
        }
        case 'faq': {
          processFaqElements(section.elements)
          break
        }
      }
    })

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

  return {
    generateHtml,
    processedHtml,
    faqs
  }
}