<template>
    <div class="">
      <q-list bordered separator>
        <q-item>
          <q-item-section>
            <div class="row justify-between">
              <span class="c-box-title">Identity</span>
              <div>
                <q-btn round size="sm" color="default" text-color="#333333" @click="openIdentityForm($event)"><i class="fa fa-pen"></i></q-btn>
              </div>
            </div>
          </q-item-section>
        </q-item>
        
       <!-- <q-expansion-item
          :default-opened="defaultOpenType === 'first' || defaultOpenType === 'all'"
          icon="info"
          label="À propos"
          header-class="text-primary"
        >
        <template #header>
          <div class="full-width row">
            <span class="c-box-title">À propos</span>
            <div class="q-pl-md">
            </div>
          </div>
        </template>
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <revenue-select v-model="company.revenue" />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input v-model="company.foundingDate" type="date" label="Date de fondation" outlined dense />
                </div>
                <div class="col-12">
                  <textarea-input v-model="company.benefits" label="Benefits" />
                </div>
                <div class="col-12">
                  <textarea-input v-model="company.mission" label="Mission" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
  
        <q-expansion-item
          :default-opened="defaultOpenType === 'all'"
          icon="style"
          label="Identité"
          header-class="text-primary"
        >
        <template #header>
        <div class="full-width row" @click="openIdentityForm($event)">
            <span class="c-box-title col-2">Identité</span>
            <div class="q-pl-md">
            </div>
          </div>
        </template>
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input v-model="company.primaryStyle" label="Style primaire" outlined dense />
                </div>
                <div class="col-12">
                  <q-select
                    v-model="company.writingTone"
                    :options="toneOptions"
                    label="Ton rédaction"
                    multiple
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-file v-model="company.favicon" label="Favicon" outlined dense>
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="col-12 col-sm-6">
                  <q-file v-model="company.logo" label="Logo complet" outlined dense>
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          :default-opened="defaultOpenType === 'all'"
          icon="business"
          label="Industry"
          header-class="text-primary"
        >
        <template #header>
        <div class="full-width row">
            <span class="c-box-title col-2">Industry</span>

            <div class="q-pl-md">
            </div>
          </div>
        </template>
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-select v-model="company.sector" :options="sectorOptions" label="Secteur" outlined dense />
                </div>
                <div class="col-12">
                  <textarea-input v-model="company.trends" label="Tendances" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
  
        <q-expansion-item
          :default-opened="defaultOpenType === 'all'"
          icon="compare"
          label="Compétiteurs"
          header-class="text-primary"
        >
        <template #header>
        <div class="full-width row">
            <span class="c-box-title col-2">Compétiteur</span>
            <div class="q-pl-md">
            </div>
          </div>
        </template>
          <q-card>
            <q-card-section>
              <div class="row q-col-gutter-md">
                <template v-for="i in 3" :key="i">
                  <div class="col-12">
                    <q-card bordered>
                      <q-card-section>
                        <div class="text-h6">Compétiteur {{ i }}</div>
                        <div class="row q-col-gutter-sm">
                          <div class="col-12">
                            <q-input v-model="company.competitors[i-1].url" label="URL" outlined dense />
                          </div>
                          <div class="col-12">
                            <textarea-input v-model="company.competitors[i-1].pros" label="Pros" />
                          </div>
                          <div class="col-12">
                            <textarea-input v-model="company.competitors[i-1].cons" label="Cons" />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>-->
      </q-list>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useClientStore } from '~/src/stores/clientStore';
  import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';

  interface Competitor {
    url: string;
    pros: string;
    cons: string;
  }
  
  interface Company {
    revenue: string;
    foundingDate: string;
    benefits: string;
    mission: string;
    primaryStyle: string;
    writingTone: string[];
    favicon: File | null;
    logo: File | null;
    sector: string;
    trends: string;
    competitors: Competitor[];
  }
  
  const props = defineProps<{
    modelValue?: Company;
    defaultOpenType?: 'none' | 'first' | 'all';
  }>();
  
  const emit = defineEmits(['update:modelValue']);

  const clientStore = useClientStore()
  const mainDisplayStore = useMainDisplayStore()
  const theClient = computed(() => clientStore.theClient) 


  const company = ref<Company>({
    revenue: '',
    foundingDate: '',
    benefits: '',
    mission: '',
    primaryStyle: '',
    writingTone: [],
    favicon: null,
    logo: null,
    sector: '',
    trends: '',
    competitors: Array(3).fill({}).map(() => ({ url: '', pros: '', cons: '' }))
  });
  
  const toneOptions = ['Formel', 'Informel', 'Professionnel', 'Amical', 'Technique'];
  const sectorOptions = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'];


  const openIdentityForm = async (event: Event) =>{
    const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
    await theClient.value.getBio()
    await theClient.value.getStyle()

    clientStore.setClient(theClient.value)
    mainDisplayStore.pushPopup({
    view: 'ClientEditor',
    item: {},
    isOpen: true,
    triggerElement: triggerRect
  })
  }
  
  watch(company, (newValue) => {
    emit('update:modelValue', newValue);
  }, { deep: true });
  </script>