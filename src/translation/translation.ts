import marketingEn from '@/src/translation/marketing/en.json';
import marketingFr from '@/src/translation/marketing/fr.json';
import sharedEn from '@/src/translation/shared/en.json';
import sharedFr from '@/src/translation/shared/fr.json';
import brandingFr from '@/src/translation/branding/fr.json'
import brandingEn from '@/src/translation/branding/en.json'


const messages = {
  en: {
    ...marketingEn,
    ...sharedEn,
    ...brandingEn
  },
  fr: {
    ...marketingFr,
    ...sharedFr,
    ...brandingFr
  },
};

export default messages
