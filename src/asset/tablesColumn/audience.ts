const columns = [
  {
    name: 'name',
    label: 'Title',
    field: 'name',
    align: 'left' as const,
    type: 'hover',
    sortable: true
  }, {
    name: 'gics',
    label: 'Industry',
    field: (row: any) => row.gics?.industryName || 'N/A',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'revenue',
    label: 'Revenue',
    field: 'revenue',
    align: 'left' as const,
    sortable: true,
    format: (val: string) => {
      const ranges: { [key: string]: string } = {
        '0-500000': '< 500K',
        '500000-1000000': '500K - 1M',
        '1000000-5000000': '1M - 5M',
        '5000000-10000000': '5M - 10M',
        '10000000-50000000': '10M - 50M',
        '50000000-100000000': '50M - 100M',
        '100000000+': '> 100M'
      }
      return ranges[val] || 'N/A'
    }
  },
  {
    name: 'score',
    label: 'Score',
    field: 'score',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'location',
    label: 'Location',
    field: (row: any) => `${row.cityId ? 'City' : row.stateId ? 'State' : row.countryId ? 'Country' : 'N/A'}`,
    align: 'left' as const,
    sortable: true
  }
]
export default columns
