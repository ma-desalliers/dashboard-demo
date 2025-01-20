import marketingEn from '@/src/translation/marketing/en.json';
import marketingFr from '@/src/translation/marketing/fr.json';
import sharedEn from '@/src/translation/shared/en.json';
import sharedFr from '@/src/translation/shared/fr.json';

const messages = {
  en: {
    ...marketingEn,
    ...sharedEn
  },
  fr: {
    ...marketingFr,
    ...sharedFr
  },
};

export default messages
