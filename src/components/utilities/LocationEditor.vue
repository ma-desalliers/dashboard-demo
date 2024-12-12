<template>
  <div class="row q-col-gutter-md q-ml-none q-pl-none">
    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedCountryId"
        :options="filteredCountries"
        :loading="loadingCountries"
        option-label="name"
        option-value="id"
        label="Country"
        outlined
        dense
        clearable
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        input-debounce="300"
        @filter="filterCountries"
        @update:model-value="handleCountryChange"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results found</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedStateId"
        :options="filteredStates"
        :loading="loadingStates"
        option-label="name"
        option-value="id"
        label="State"
        outlined
        dense
        clearable
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        input-debounce="300"
        :disable="!selectedCountryId"
        @filter="filterStates"
        @update:model-value="handleStateChange"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results found</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedCityId"
        :options="filteredCities"
        :loading="loadingCities"
        option-label="name"
        option-value="id"
        label="City"
        outlined
        dense
        clearable
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        input-debounce="300"
        :disable="!selectedStateId"
        @filter="filterCities"
        @update:model-value="handleCityChange"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results found</q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { Location } from '@/src/repository/location/Location';
import type { CountryObject, StateObject, CityObject } from '@/src/repository/location/Interface';

const $q = useQuasar();
const theLocation = new Location();

const props = defineProps<{
    countryId: number | undefined;
    stateId: number | undefined;
    cityId: number | undefined;
}>();

const emit = defineEmits(['update:countryId', 'update:stateId', 'update:cityId']);

const loadingCountries = ref(false);
const loadingStates = ref(false);
const loadingCities = ref(false);

const selectedCountryId = ref<number | undefined>(undefined);
const selectedStateId = ref<number | undefined>(undefined);
const selectedCityId = ref<number | undefined>(undefined);

const countries = ref<CountryObject[]>([]);
const states = ref<StateObject[]>([]);
const cities = ref<CityObject[]>([]);

const filteredCountries = ref<CountryObject[]>([]);
const filteredStates = ref<StateObject[]>([]);
const filteredCities = ref<CityObject[]>([]);

const loadCountries = async () => {
  try {
    loadingCountries.value = true;
    countries.value = await theLocation.getAllCountries();
    filteredCountries.value = countries.value;

    const canada = countries.value.find(country => 
      country.name.toLowerCase() === "canada"
    );

    if (canada) {
      selectedCountryId.value = canada.id;
      loadStates(canada.id);
    }
  } catch (error) {
    console.error('Error loading countries:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load countries',
      position: 'top'
    });
  } finally {
    loadingCountries.value = false;
  }
};

const loadStates = async (countryId: number) => {
  try {
    loadingStates.value = true;
    states.value = await theLocation.getStatesByCountry(countryId);
    filteredStates.value = states.value;
  } catch (error) {
    console.error('Error loading states:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load states',
      position: 'top'
    });
  } finally {
    loadingStates.value = false;
  }
};

const loadCities = async (stateId: number) => {
  try {
    loadingCities.value = true;
    cities.value = await theLocation.getCitiesByState(stateId);
    filteredCities.value = cities.value;
  } catch (error) {
    console.error('Error loading cities:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load cities',
      position: 'top'
    });
  } finally {
    loadingCities.value = false;
  }
};

const filterCountries = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredCountries.value = countries.value;
    } else {
      const needle = val.toLowerCase();
      filteredCountries.value = countries.value.filter(
        country => country.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const filterStates = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredStates.value = states.value;
    } else {
      const needle = val.toLowerCase();
      filteredStates.value = states.value.filter(
        state => state.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const filterCities = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredCities.value = cities.value;
    } else {
      const needle = val.toLowerCase();
      filteredCities.value = cities.value.filter(
        city => city.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

const handleCountryChange = (countryId: number | undefined) => {
  selectedCountryId.value = countryId;
  selectedStateId.value = undefined;
  selectedCityId.value = undefined;
  states.value = [];
  cities.value = [];
  filteredStates.value = [];
  filteredCities.value = [];

  if (countryId) {
    loadStates(countryId);
  }

  emitUpdate();
};

const handleStateChange = (stateId: number | undefined) => {
  selectedStateId.value = stateId;
  selectedCityId.value = undefined;
  cities.value = [];
  filteredCities.value = [];

  if (stateId) {
    loadCities(stateId);
  }

  emitUpdate();
};

const handleCityChange = (cityId: number | undefined) => {
  selectedCityId.value = cityId;
  emitUpdate();
};

const emitUpdate = () => {
  console.log('emit upodate', selectedCountryId.value)
  emit('update:countryId', selectedCountryId.value);
  emit('update:stateId', selectedStateId.value);
  emit('update:cityId', selectedCityId.value);
};

onMounted(() => {
  loadCountries();
});

watch(() => props.countryId, (newValue) => {
  if (newValue) {
    selectedCountryId.value = props.countryId;
    selectedStateId.value = props.stateId;
    selectedCityId.value = props.cityId;

    if (props.countryId) {
      loadStates(props.countryId);
    }
    if (props.stateId) {
      loadCities(props.stateId);
    }
  }
}, { immediate: true });
</script>