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
    loading: false,
    currentRequest: null as AbortController | null
  }),
  getters: {
    getProduct: (state) => (productUuid: string) => state.products.find((product) => product.uuid === productUuid),
    totalProducts: (state) => state.products.length
  },
  actions: {
    async init(companyUuid: string) {
      if (companyUuid === this.companyUuid && this.products.length > 0) return;
      this.loading = true;
      this.abortCurrentRequest();

      const controller = new AbortController();
      this.currentRequest = controller;
      try {
        const productRepository = new ProductRepository();
        const products = productRepository.list(companyUuid, controller.signal);
        this.companyUuid = companyUuid;
        const categoryRepository = new CategoryRepository();
        const categories = categoryRepository.list(companyUuid, controller.signal);
        const [productsResponse, categoriesResponse] = await Promise.all([products, categories]);
        this.products = productsResponse;
        this.categories = categoriesResponse.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
        this.currentRequest = null;
      }
    },
    async current(productUuid: string) {
      const product = this.getProduct(productUuid);
      if (!product) throw new Error('Product not found');
      this.theProduct = product;
    },
    abortCurrentRequest() {
      if (this.currentRequest == null) return;
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
});
