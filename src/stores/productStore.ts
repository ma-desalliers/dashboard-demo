import type { ProductCategory, Product } from "@/src/repository/products/Interfaces";
import { CategoryRepository, ProductRepository } from "@/src/repository/products/Repository";
import type { PaginationMeta } from "@/src/repository/BaseRepository";

// TODO: category_product link
// TODO: product page count
export const useProductStore = defineStore('useProductStore', {
  state: () => ({
    companyUuid: '',
    theProduct: {} as Product,
    products: [] as Product[],
    categories: [] as ProductCategory[],
    categoriesPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    } as PaginationMeta,
    loading: false
  }),
  getters: {
    getProduct: (state) => (productUuid: string) => state.products.find((product) => product.uuid === productUuid),
    totalProducts: (state) => state.products.length
  },
  actions: {
    async init(companyUuid: string) {
      if (companyUuid === this.companyUuid && this.products.length > 0) return;
      this.companyUuid = companyUuid;
      this.loading = true;
      try {
        const productRepository = new ProductRepository();
        const products = await productRepository.getProducts(companyUuid);
        this.products = products;
        const categoryRepository = new CategoryRepository();
        const categories = await categoryRepository.getCategories(companyUuid);
        this.categories = categories.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async current(productUuid: string) {
      const product = this.getProduct(productUuid);
      if (!product) throw new Error('Product not found');
      this.theProduct = product;
    }
  }
});
