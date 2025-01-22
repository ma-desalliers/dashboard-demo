const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left' as const,
    type:'hover',
    sortable: true
  },
  {
    name: 'category',
    label: 'Category',
    field: (row:any) => row.category,
    align: 'left' as const,
    type:'badge',
    color:'primary',
    options:[],
    updateFn: () => {},
    sortable: true
  },
  {
    name: 'subcategory',
    label: 'Subcategory',
    field: (row:any) => row.subcategory?.name,
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'score',
    label: 'Score',
    field: 'score',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'pageCount',
    label: 'Pages',
    field: 'pageCount',
    align: 'left' as const,
    sortable: true
  }
]

export default columns