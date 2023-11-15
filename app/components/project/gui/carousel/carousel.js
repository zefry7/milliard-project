import $ from 'jquery';
import { registerPlugins, Plugin } from '../../../framework/jquery/plugins/plugins.js';

import Swiper, {Mousewheel, Navigation, Pagination, Autoplay} from 'swiper';

Swiper.use([Navigation,Pagination,Mousewheel, Autoplay]);

const PRESETS = {
  default: {
    // preloadImages: false,
    // // Enable lazy loading
    // lazy: true,
    // watchSlidesProgress: true,
    // watchSlidesVisibility: true,
    slidesPerView: "auto",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  },
  free_scroll: {
    freeMode: true
  },
  carouselWinners: {
    slidesPerView: "auto",
    centeredSlides: true,
    // spaceBetween: 40,
    loop: true,
    navigation: {
      nextEl: ".winners__bt-right",
      prevEl: ".winners__bt-left",
    },
  }
};

export class Carousel extends Plugin {
  constructor($element) {
    super($element);
    let data = $element.data('carousel');
    if (typeof data === 'string') {
      data = PRESETS[data];
    }

    this.$element = $element;

    const containerSelector = $element.data("container-selector");
    if (containerSelector)
      this.$container = $element.closest(containerSelector);

    this.initCounter();

    this.carousel = new Swiper(
      $element.get(0),
      $.extend({
        on: {
          slideChange: this.onSlideChange,
          update: this.onUpdate
        }
      }, PRESETS.default, data)
    );

    this.onSlideChange();
  }

  initCounter() {
    const { $container, $element } = this;

    if (!$container) return;

    const counterSelector = $element.data("counter-selector");
    if (counterSelector)
      this.$counter = $container.find(counterSelector).eq(0);

    const totalSelector = $element.data("total-selector");
    if (totalSelector)
      this.$total = $container.find(totalSelector).eq(0);
  }

  onUpdate = (swiper) => {
    this.checkSlides(swiper);
  };

  onSlideChange = () => {
    this.checkSlides();
  };

  checkSlides(swiper) {
    if (!this.carousel && swiper) this.carousel = swiper;
    const { carousel: { activeIndex, slides: { length } } } = this;

    if (this.$counter)
      this.$counter.text(String(activeIndex + 1));

    if (this.$total)
      this.$total.text(String(length));
  }

  getCarousel() {
    return this.carousel;
  }

  destroy() {
    super.destroy();
    if (this.carousel)
      this.carousel.destroy();
    this.carousel = null;

    this.$total = null;
    this.$counter = null;
    this.$element = null;
  }

}

registerPlugins(
  {
    'name': 'carousel',
    'Constructor': Carousel,
    'selector': '.carousel'
  }
);
