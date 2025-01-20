const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'category',
    label: 'Category',
    field: (row:any) => row.category?.name,
    align: 'left' as const,
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
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'uuid',
    align: 'left' as const,
    type: 'actions',
    actions: [
      {
        label: 'View Details',
        icon: 'visibility',
        color: 'info',
        handler: (row:any) => {
          if (row.ctaUrl) {
            window.open(row.ctaUrl, '_blank')
          }
        }
      },
      {
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        handler: (row:any) => row.onEdit?.(row)
      },
      {
        label: 'Delete',
        icon: 'delete',
        color: 'negative',
        handler: (row:any) => row.onDelete?.(row)
      }
    ]
  }
]

export default columns