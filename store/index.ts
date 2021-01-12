import { MutationTree, ActionTree, GetterTree } from 'vuex';
import { RootState, Photo, Book } from '~/types';
import axios from 'axios';
import parser from 'fast-xml-parser';

export const state = (): RootState => ({
  loading: false,
  photos: [],
  firstPhotoUrl: '',
  theme: 'light',
  bg: '',
  books: [],
  currentBooks: [],
  firstBookImageUrl: '',
});

export const getters: GetterTree<RootState, RootState> = {
  theme(localState: RootState) {
    return localState.theme;
  },

  bg(localState: RootState) {
    return localState.bg;
  },

  photos(localState: RootState) {
    return localState.photos;
  },

  firstPhotoUrl(localState: RootState) {
    return localState.firstPhotoUrl;
  },

  currentBooks(localState: RootState) {
    return localState.currentBooks;
  },

  books(localState: RootState) {
    return localState.books;
  },

  firstBookImageUrl(localState: RootState) {
    return localState.firstBookImageUrl;
  }
};

export const mutations: MutationTree<RootState> = {
  setPhotos(localState: RootState, photos: Photo[]): void {
    localState.photos = photos;
  },

  setFirstPhotoUrl(localState: RootState, url): void {
    localState.firstPhotoUrl = url;
  },

  setTheme(localState: RootState, theme): void {
    localState.theme = theme;
  },

  setBg(localState: RootState, bg): void {
    localState.bg = bg;
  },

  setBooks(localState: RootState, books: Book[]): void {
    localState.books = books;
  },

  setCurrentBooks(localState: RootState, books: Book[]): void {
    localState.currentBooks = books;
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async getPhotos({ commit }) {
    try {
      const tokenResponse = await axios.get('https://ig.instant-tokens.com/users/11ae0c52-8c0d-47c7-b146-dec0e2c3aeda/instagram/17841401548274180/token?userSecret=yqd5y2bpyqgas8q2spba6k');
      const response = await axios
      .get(
        `https://graph.instagram.com/17841401548274180/media?fields=media_url,caption&access_token=${
          tokenResponse.data.Token
        }`
      )

      const photos = response.data.data.slice(0, 18);
      commit('setPhotos', photos);
      commit('setFirstPhotoUrl', photos[0].media_url);

      return photos;
    } catch (error) {
      // in case we wanna show error page
      // return Promise.reject(error);
    }
  },

  async getBooks({ commit }) {
    // ¯\_(ツ)_/¯
    // https://www.goodreads.com/topic/show/17893514-cors-access-control-allow-origin
    try {
      const response = await axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/review/list/90882699.xml?key=${process.env.GOODREADS_API_KEY}&shelf=favourites&sort=position`
        , {
          headers: {
            origin: process.env.baseUrl,
          }
        });

        const json = parser.parse(response.data);
        commit('setBooks', json.GoodreadsResponse.books.book);
    } catch (error) {
      //
    }
  },

  async getCurrentBooks({ commit }) {
    // ¯\_(ツ)_/¯
    // https://www.goodreads.com/topic/show/17893514-cors-access-control-allow-origin
    try {
      const response = await axios
        .get(
          `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/review/list/90882699.xml?key=${process.env.GOODREADS_API_KEY}&shelf=currently-reading&sort=position`
        , {
          headers: {
            origin: process.env.baseUrl,
          }
        });

        const json = parser.parse(response.data);
        commit('setCurrentBooks', json.GoodreadsResponse.books.book);

    } catch (error) {
      //
    }
  }
};
