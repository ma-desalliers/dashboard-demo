<template>
  <Brands :brand-data="brand"></Brands>
</template>
<script lang="ts" setup>
import products from '@/src/components/company/products/products.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import companyMenu from '~/src/asset/menu/company';
import { useCompanyStore } from '~/src/stores/companyStore';
import Brands from '~/src/components/company/brands.vue';

definePageMeta({
  middleware: ['auth', 'company']
})

const mainDisplayStore = useMainDisplayStore()
const companyStore = useCompanyStore();

const brand = {
  "brand_guide": {
    "design": {
      "primary_color": "#1976D2",
      "secondary_color": "#26A69A",
      "accent_color": "#9C27B0",
      "text_colors": {
        "primary": "#000000",
        "secondary": "#424242",
        "light": "#757575"
      },
      "typography": {
        "primary_font": "Roboto",
        "secondary_font": "Open Sans",
        "heading_sizes": {
          "h1": "2.5rem",
          "h2": "2rem",
          "h3": "1.75rem",
          "h4": "1.5rem",
          "h5": "1.25rem",
          "h6": "1rem"
        }
      },
      "spacing": {
        "unit": "8px",
        "small": "0.5rem",
        "medium": "1rem",
        "large": "1.5rem"
      }
    },
    "personality": {
      "values": ["integrity", "excellence", "customer-centric", "innovation", "sustainability", "diversity", "collaboration", "accountability", "respect", "creativity", "reliability", "quality", "transparency", "responsibility", "adaptability", "commitment", "empathy", "passion", "loyalty", "consistency"],
      "qualities": ["approachable", "dynamic", "reliable", "versatile", "adaptable", "visionary", "dedicated", "innovative", "proactive", "thoughtful", "friendly", "professional", "authentic", "trustworthy", "bold", "sophisticated", "passionate", "empathetic", "confident", "resourceful"],
      "humanness": ["empathetic", "authentic", "relatable", "warm", "caring", "genuine", "supportive", "inclusive", "kind", "humble"],
      "distinctiveness": ["unique", "memorable", "iconic", "innovative", "creative", "bold", "trailblazing", "exceptional", "standout", "remarkable"],
      "style": {
        "detail_level": ["high-level", "in-depth", "comprehensive", "detailed", "overview", "summarized", "extensive", "elaborate", "focused", "targeted"],
        "preferred_approach": "comprehensive",
        "content_depth": "balanced",
        "presentation_style": "professional"
      }
    },
    "tone_of_voice": {
      "clarity": ["clear", "concise", "direct", "transparent", "unambiguous", "straightforward", "lucid", "coherent", "elegant", "precise"],
      "emotional_tone": ["exciting", "trustworthy", "compassionate", "inspiring", "optimistic", "empathetic", "confident", "calm", "enthusiastic", "serious", "hopeful", "compelling", "motivational", "uplifting", "authoritative", "friendly", "sincere", "passionate", "engaging", "reassuring"],
      "use_of_humor": ["humorous", "serious", "neutral", "playful", "witty", "dry", "sarcastic", "light-hearted", "self-deprecating", "subtle"],
      "formality_level": ["formal", "semi-formal", "informal", "professional", "casual", "business casual", "technical", "conversational", "polite", "friendly"],
      "voice": ["active", "passive"],
      "primary_tone": "professional",
      "secondary_tone": "friendly",
      "situational_adjustments": {
        "technical_content": "formal",
        "social_media": "casual",
        "customer_support": "helpful",
        "marketing": "engaging"
      }
    },
    "rules": {
      "language": {
        "contractions": {
          "preference": "use",
          "exceptions": ["formal documentation", "legal content"]
        },
        "slang": {
          "preference": "avoid",
          "exceptions": ["social media", "casual blog posts"]
        },
        "jargon_usage": {
          "preference": "minimal",
          "context": "only in technical contexts",
          "audience_consideration": "based on reader expertise"
        }
      },
      "punctuation": {
        "oxford_comma": {
          "preference": "use",
          "consistency": "always"
        },
        "ellipsis_usage": {
          "preference": "use sparingly and only for trailing thoughts",
          "contexts": ["informal communication", "social media"]
        },
        "exclamation_marks": {
          "preference": "use sparingly",
          "limit": "one per paragraph",
          "exceptions": ["congratulatory messages", "celebrations"]
        },
        "question_marks": {
          "preference": "use where appropriate",
          "contexts": ["rhetorical questions", "direct questions"]
        },
        "semicolon_usage": {
          "preference": "use to connect related independent clauses",
          "frequency": "moderate"
        }
      },
      "capitalization": {
        "proper_nouns": {
          "preference": "always capitalize",
          "includes": ["brand names", "product names", "feature names"]
        },
        "titles": {
          "preference": "capitalize the first letter of each major word",
          "style": "title case"
        },
        "acronyms": {
          "preference": "always capitalize",
          "first_usage": "spell out with acronym in parentheses"
        },
        "headline_capitalization": {
          "preference": "title case",
          "exceptions": ["blog post titles - sentence case"]
        }
      },
      "sentence_structure": {
        "preferred_lengths": {
          "optimal": "medium",
          "maximum_words": 25,
          "variety": "mix of short and medium"
        },
        "complexity": {
          "preference": "simple",
          "variation": "use compound when needed for flow"
        },
        "paragraph_length": {
          "optimal": "3-4 sentences",
          "maximum": "6 sentences"
        }
      },
      "terminology": {
        "preferred_terms": ["cutting-edge", "seamless", "robust", "state-of-the-art", "innovative", "user-friendly", "scalable", "intuitive", "efficient", "streamlined", "flexible", "comprehensive", "reliable", "effective", "powerful", "advanced", "transformative", "impactful", "versatile", "optimized"],
        "prohibited_terms": ["utilize", "synergy", "leverage", "endeavor", "paradigm shift", "think outside the box", "innovative solution", "game-changer", "disruptive", "best in class", "proactive", "holistic", "bandwidth", "onboarding", "pivot", "drill down", "touch base", "circle back", "push the envelope"],
        "industry_jargon": ["API", "SaaS", "cloud-native", "machine learning", "AI-driven", "big data", "IoT", "blockchain", "cybersecurity", "DevOps", "KPI", "ROI", "CRM", "UX/UI", "front-end", "back-end", "full-stack", "microservices", "agile", "scrum"]
      },
      "point_of_view": {
        "perspectives": ["first person singular (I)", "first person plural (we)", "second person (you)", "third person (he, she, they)"],
        "primary_preference": "first person plural (we)",
        "secondary_preference": "second person (you)",
        "consistency": {
          "rule": "Maintain the chosen POV across all content.",
          "context_switches": "Align POV with audience engagement strategies.",
          "documentation": "Use third person for technical documentation"
        }
      },
      "content_structure": {
        "headings": {
          "frequency": "every 300 words minimum",
          "hierarchy": "maintain clear H1 > H2 > H3 structure"
        },
        "lists": {
          "style": "bullet points for unordered, numbers for sequential",
          "length": "3-7 items optimal"
        },
        "paragraphs": {
          "length": "3-4 sentences optimal",
          "structure": "topic sentence followed by supporting details"
        }
      }
    }
  }
}


onMounted(()=>{
  const companyUuid = companyStore.theCompany.uuid
  mainDisplayStore.setContextMenu(companyMenu(companyUuid))
})

</script>