const { Item, ItemAttribute, Category, Business } = require("./models/index");
const sequelize = require("./db.js");

// const categoriesData = [];

// const transformData = (data) =>
//   data.map((item) => ({
//     id: item.id,
//     level: item.level,
//     titleRu: item.title,
//     titleKz: "-",
//     commissionStart: item.commission_start,
//     commissionEnd: item.commission_end,
//     parentId: item.parent_id,
//     parentTitleRu: item.parent_title,
//     parentTitleKz: "-",
//     mainCategoryId: item.main_category_id,
//     mainCategoryTitleRu: item.main_category_title,
//     mainCategoryTitleKz: "-",
//     hasChild: item.has_child,
//   }));

// const d = async () => {
//   try {
//     const count = await Category.count();
//     console.log(`Количество категорий в базе: ${count}`);
//     console.log(`Всего категорий для загрузки: ${categoriesData.length}`);

//     const errors = [];

//     for (const category of transformData(categoriesData)) {
//       try {
//         await Category.create(category); // Создаём категорию по одной
//       } catch (error) {
//         console.error(
//           `Ошибка при создании категории ${category.titleRu}:`,
//           error.message
//         );
//         errors.push({ category: category.titleRu, error: error.message });
//       }
//     }

//     console.log("Категории успешно загружены в базу данных");

//     if (errors.length > 0) {
//       console.log("Ошибки при загрузке категорий:");
//       console.table(errors);
//     }
//   } catch (error) {
//     console.error("Глобальная ошибка при загрузке категорий:", error);
//   }
// };

// d();

const initialFlowers = [
  {
    id: "1",
    title: "Микс роз (букет из премиальных цветов)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 20250,
    originalPrice: 22500,
    flowerCount: 15,
    flowerHeight: 60,
    discount: 10,
    features: [
      { code: "fragrant", title: "Ароматные" },
      { code: "hypoallergenic", title: "Гипоаллергенные" },
    ],
    images: [
      {
        url: "https://content2.flowwow-images.com/data/flowers/524x524/59/1689246001_48974859.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Кустовые розы (букет из премиальных цветов)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 38675,
    originalPrice: 45500,
    flowerCount: 25,
    flowerHeight: 70,
    discount: 15,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://resources.cdn-kaspi.kz/img/m/p/h83/hb6/65132280250398.jpg?format=gallery-large",
      },
    ],
  },
  {
    id: "3",
    title: "51 роза (букет из премиальных цветов)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 36575,
    originalPrice: 38500,
    flowerCount: 51,
    flowerHeight: 60,
    discount: 5,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://cdn1.ozone.ru/s3/multimedia-m/c600/6786788206.jpg",
      },
    ],
  },
  {
    id: "4",
    title: "Juliette Roses (букет из премиальных цветов)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "hydrangeas", title: "Гортензия" }],
    price: 16200,
    originalPrice: 18000,
    flowerCount: 11,
    flowerHeight: 55,
    discount: 10,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://main-cdn.sbermegamarket.ru/big2/hlr-system/-15/202/842/411/125/183/7/600014279832b1.jpeg",
      },
    ],
  },
  {
    id: "5",
    title: "Пионы розовые (букет 7 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "peonies", title: "Пионы" }],
    price: 20000,
    originalPrice: 20000,
    flowerCount: 7,
    flowerHeight: 50,
    discount: 0,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://content2.flowwow-images.com/data/flowers/524x524/30/1549098965_85620930.jpg",
        url: "https://yandex-images.clstorage.net/H50GdG234/3bd5de8JB-/tNQ1k2Oh3HKsSSP_ei3FRxBztdbM8xtnckQtgC6aOx2rX67ZpPVV8YcOu9-4OyNm673cDs8ZrT1qn_10uvrSOqKUO999985wvU1ntWwhk1UIPvvX2v8EFkNgGO0WsB15gWaJw-qqA6TNEumS0ksxY5zFq1mLbvQXeN6uF9zogky84En-JqPLQYxHGeoeKNJVT1mE1fDDCyB5bA_9PrYkRb5MlN3fnRS1xVj0o_99SH6TwYdWm0vlEGXcgBzw-bxSjcZ5_wOI6V6yfx3gEibPUlJOnszu3ho_V3gN5C61LmCUaaLryqASpOJN05n3eXxmsv6-Tb1H5DZNzaAP7M-wZarBRPU5h8Zcmm4i9iU5wkBVY5bM3OwLEGpPCt0IsydljECg3MeILbjZUfOPwGBoV7brpW-cfcQOXcCEPdDhgG298kTQKpHLf5lDMOoSLNtxaFu_3cTVKSpmThbeHoUjYqxfsc_vtAyH7X3an_lYY16_7Jpwtn_7LFv_vDzLz5BHtONH0gu523qKXCjhHSbYckhfmfzFxAA9TXst5R6XDWqKW4Hg5Lw0iuBG15z7cnVBqc-5U7JN2xB8xp8qz-iVYariQPgKhttcq14Q6CwL8XxVa6Tz5fMPLFVCDdcBpQ5HqHaI98KOHbLNVtS9yVxjf7DGlmeWRtE7TNu0LOf-q1mL9XnuILH7UJtyPuEcD8N4dmi79tvbGwd7VTDMIIsHU5N4kP7mrQag0VbNv_9-RXWz56REkn3kGmb8iBX-0bdwhu5m6CCa-3CqTD32GxXLclJihvXB9y0AWmAt7AenLVKgTI_ozqwekMxK9Y3sY3pSlu6bU5hr-B5pxYICwO2IZKjyaPEciM9QtGk8yyQRxnlNRbLf6dUxG3JgEN8xtSJ-vl-O_vuCAYT_UPGBxGRAd77sjUuHTvAISu64D8PMiX6S7WDGD7nSSb5fCfYdNcplTnyy-971IAV1SBjmBYw",
      },
    ],
  },
  {
    id: "6",
    title: "Орхидеи фиолетовые (2 ветки)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "orchids", title: "Орхидеи" }],
    price: 17600,
    originalPrice: 22000,
    flowerCount: 3,
    flowerHeight: 80,
    discount: 20,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://venusinfleurs.ru/image/catalog/product/4193/4193_1.jpg",
      },
    ],
  },
  {
    id: "7",
    title: "Лилии белые (букет 5 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 13300,
    originalPrice: 14000,
    flowerCount: 5,
    flowerHeight: 65,
    discount: 5,
    features: [{ title: "Гипоаллергенные", code: "hypoallergenic" }],
    images: [
      {
        url: "https://flor2u.ru/images/uploads/conversion/1f9/1f90052c1012489f9e826f9a4b10be85/1f90052c1012489f9e826f9a4b10be85-flor.detail.gallery.jpg",
      },
    ],
  },
  {
    id: "8",
    title: "Гвоздики красные (букет 9 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 9000,
    originalPrice: 9000,
    flowerCount: 9,
    flowerHeight: 45,
    discount: 0,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://i2.storeland.net/2/8891/188900145/afacdb/buketkrasnyhgvozdik1-jpg.jpg",
      },
    ],
  },
  {
    id: "9",
    title: "Альстромерии микс (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "alstroemeria", title: "Альстромерия" }],
    price: 9500,
    originalPrice: 10000,
    flowerCount: 11,
    flowerHeight: 50,
    discount: 5,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://content2.flowwow-images.com/data/flowers/524x524/30/1549098965_85620930.jpg",
      },
    ],
  },
  {
    id: "10",
    title: "Белые розы (букет 25 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 14400,
    originalPrice: 16000,
    flowerCount: 21,
    flowerHeight: 70,
    discount: 10,
    features: ["Бенто-торт"],
    images: [
      {
        url: "https://владивосток.цветы-доставка24.рф/image/cache/catalog/image//catalog/cvety-i-bento/buket-15-roz-kenia-i-bento-tort-300x300.jpg",
      },
      {
        url: "https://pro-buket.kz/wp-content/uploads/2023/02/25-bel-roz__-scaled.webp?ver=2",
      },
    ],
  },
  {
    id: "11",
    title: "Ранункулюсы белые (букет 7 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "ranunculus", title: "Ранункулюсы" }],
    price: 16150,
    originalPrice: 19000,
    flowerCount: 7,
    flowerHeight: 55,
    discount: 15,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://pro-buket.kz/wp-content/uploads/2021/08/%D0%91%D0%B5%D0%BB%D1%8B%D0%B5-%D1%80%D0%B0%D0%BD%D1%83%D0%BD%D0%BA%D1%83%D0%BB%D1%8E%D1%81%D1%8B-2-min.webp?ver=2",
      },
    ],
  },
  {
    id: "12",
    title: "Роза красная (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 25000,
    originalPrice: 30000,
    flowerCount: 21,
    flowerHeight: 60,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://cvetok24.kz/upload/resize_cache/webp/upload/iblock/c78/c7895fa60187a64a1feef100b6afa90c.webp",
      },
    ],
  },
  {
    id: "13",
    title: "Лилии белые (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 17500,
    originalPrice: 20000,
    flowerCount: 11,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://flor2u.ru/images/uploads/conversion/e3b/e3b827314cb38e7af3a7bb70c207e687/e3b827314cb38e7af3a7bb70c207e687-flor.detail.gallery.jpg",
      },
    ],
  },
  {
    id: "14",
    title: "Гвоздики розовые (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 11250,
    originalPrice: 15000,
    flowerCount: 15,
    flowerHeight: 50,
    discount: 25,
    features: [
      { code: "fragrant", title: "Ароматные" },
      { code: "hypoallergenic", title: "Гипоаллергенные" },
    ],
    images: [
      {
        url: "https://florcat.ru/upload/delight.webpconverter/upload/resize_cache/iblock/078/500_500_1/0780672841c589a5c40d1e6679611643.jpg.webp?164706808132522",
      },
    ],
  },
  {
    id: "15",
    title: "Роза белая (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 45000,
    originalPrice: 50000,
    flowerCount: 51,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://cvety.kz/upload/iblock/466/lhl3pqy0b4s03gmp2cbrc808ocy6m0wi/61F0B299_26FF_4027_8693_01785E104F9B.jpeg",
      },
    ],
  },
  {
    id: "16",
    title: "Лилии розовые (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 31500,
    originalPrice: 35000,
    flowerCount: 21,
    flowerHeight: 60,
    discount: 10,
    features: [
      { code: "hypoallergenic", title: "Гипоаллергенные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      {
        url: "https://content2.flowwow-images.com/data/flowers/524x524/51/1710944365_97583151.jpg",
      },
    ],
  },
  {
    id: "17",
    title: "Ранункулюсы жёлтые (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "ranunculus", title: "Ранункулюсы" }],
    price: 18000,
    originalPrice: 20000,
    flowerCount: 15,
    flowerHeight: 55,
    discount: 10,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://venusinfleurs.ru/image/catalog/product/4196/4196_1.jpg",
      },
    ],
  },
  {
    id: "18",
    title: "Роза микс (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 42500,
    originalPrice: 50000,
    flowerCount: 51,
    flowerHeight: 60,
    discount: 15,
    features: [
      { code: "fragrant", title: "Ароматные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      {
        url: "https://avatars.mds.yandex.net/get-altay/11003990/2a0000018c36424130e630da31e0748166f5/XXL_height",
      },
    ],
  },
  {
    id: "19",
    title: "Гвоздики белые (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 9000,
    originalPrice: 12000,
    flowerCount: 11,
    flowerHeight: 50,
    discount: 25,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://zakazbuketov.kz/upload/resize_cache/webp/iblock/251/251af18dfa32da5e151f4bb16aef96c8.webp",
      },
    ],
  },
  {
    id: "20",
    title: "Лилии микс (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 22500,
    originalPrice: 25000,
    flowerCount: 15,
    flowerHeight: 70,
    discount: 10,
    features: [
      { code: "hypoallergenic", title: "Гипоаллергенные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      {
        url: "https://megacvet24.ru/image/cache/catalog/51-liliya-miks-900x900.jpg",
      },
    ],
  },
  {
    id: "21",
    title: "Роза жёлтая (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 27500,
    originalPrice: 30000,
    flowerCount: 21,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://tribuketa.ru/wp-content/uploads/2017/08/zheltye-rozy-v-krafte.jpg",
      },
    ],
  },
  {
    id: "22",
    title: "Лилии оранжевые (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 22500,
    originalPrice: 25000,
    flowerCount: 15,
    flowerHeight: 60,
    discount: 10,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://megacvet24.ru/image/cache/catalog/35-oranzhevykh-liliy-4-899x899.jpg",
      },
    ],
  },
  {
    id: "23",
    title: "Гвоздики белые (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 15000,
    originalPrice: 20000,
    flowerCount: 21,
    flowerHeight: 50,
    discount: 25,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://gorod-buketov.ru/wp-content/uploads/2019/05/4324-Buket-belyh-gvozdik.jpg",
      },
    ],
  },
  {
    id: "24",
    title: "Ранункулюсы микс (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "ranunculus", title: "Ранункулюсы" }],
    price: 18500,
    originalPrice: 22000,
    flowerCount: 15,
    flowerHeight: 55,
    discount: 15,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://shop-cdn1-2.vigbo.tech/shops/29666/products/21251215/images/3-1566aae5936c6c34a667c8f357070992.JPG",
      },
    ],
  },
  {
    id: "25",
    title: "Роза белая (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 19500,
    originalPrice: 22000,
    flowerCount: 15,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://cvety.kz/upload/resize_cache/iblock/6a8/hc1u2pmv8tuh3jya4w83trytl9jd9knu/435_545_2/WhatsApp-Image-2024_02_10-at-19.41.10-_2_.jpeg",
      },
    ],
  },
  {
    id: "26",
    title: "Лилии жёлтые (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 17000,
    originalPrice: 19000,
    flowerCount: 11,
    flowerHeight: 60,
    discount: 10,
    features: [
      { code: "hypoallergenic", title: "Гипоаллергенные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      { url: "https://venusinfleurs.ru/image/catalog/product/4161/4161_1.jpg" },
    ],
  },
  {
    id: "27",
    title: "Гвоздики красные (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 38500,
    originalPrice: 45000,
    flowerCount: 51,
    flowerHeight: 50,
    discount: 15,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://dari-cvety.com/assets/images/products/1167/buket-iz-51-krasnyh-gvozdik-2.jpg",
      },
    ],
  },
  {
    id: "28",
    title: "Роза розовая (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 20500,
    originalPrice: 23000,
    flowerCount: 15,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      { url: "https://flowers-deliver.ru/wp-content/uploads/2021/12/27-2.jpg" },
    ],
  },
  {
    id: "29",
    title: "Лилии белые (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 45000,
    originalPrice: 50000,
    flowerCount: 51,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://rozavam.ru/uploads/photos/3463/thumbs/3463_file_6328585316d55.jpg",
      },
    ],
  },
  {
    id: "30",
    title: "Гвоздики микс (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 15500,
    originalPrice: 18000,
    flowerCount: 21,
    flowerHeight: 50,
    discount: 15,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://avatars.mds.yandex.net/get-altay/11381866/2a0000018c1bf7ccc6ee4f32ddf0a1288aa1/XXXL",
      },
    ],
  },
  {
    id: "31",
    title: "Роза красная (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 47000,
    originalPrice: 52000,
    flowerCount: 51,
    flowerHeight: 70,
    discount: 10,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      {
        url: "https://cvety.kz/upload/resize_cache/iblock/52e/pqh4yxggekxtnqcu7l41c9w6fiienwcq/700_700_1/WhatsApp-Image-2024_01_31-at-13.08.52.jpeg",
      },
    ],
  },
  {
    id: "32",
    title: "Лилии розовые (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 33500,
    originalPrice: 37000,
    flowerCount: 21,
    flowerHeight: 60,
    discount: 10,
    features: [
      { code: "hypoallergenic", title: "Гипоаллергенные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      {
        url: "https://floralkiki.ru/wp-content/uploads/2024/11/1729441512_12508106.jpg",
      },
    ],
  },
  {
    id: "33",
    title: "Гвоздики жёлтые (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 12000,
    originalPrice: 15000,
    flowerCount: 15,
    flowerHeight: 50,
    discount: 20,
    features: [
      { code: "fragrant", title: "Ароматные" },
      { code: "hypoallergenic", title: "Гипоаллергенные" },
    ],
    images: [
      {
        url: "https://venusinfleurs.ru/image/cache/catalog/product/4066/4066_1-350x350.jpg",
      },
    ],
  },
  {
    id: "34",
    title: "Ранункулюсы красные (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "ranunculus", title: "Ранункулюсы" }],
    price: 16000,
    originalPrice: 19000,
    flowerCount: 11,
    flowerHeight: 55,
    discount: 15,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      {
        url: "https://dakotaflora.com/assets/images/products/1442/large/ranunkulus-krasnyi-buket-dakotaflora-1.jpg",
      },
    ],
  },
  {
    id: "35",
    title: "Роза жёлтая (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 21000,
    originalPrice: 25000,
    flowerCount: 15,
    flowerHeight: 70,
    discount: 15,
    features: [{ code: "fragrant", title: "Ароматные" }],
    images: [
      { url: "https://dostavka-tsvety.ru/wp-content/uploads/2020/06/19-1.jpg" },
    ],
  },
  {
    id: "36",
    title: "Лилии микс (букет 15 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 23000,
    originalPrice: 26000,
    flowerCount: 15,
    flowerHeight: 70,
    discount: 10,
    features: [
      { code: "hypoallergenic", title: "Гипоаллергенные" },
      { title: "Экзотические", code: "exotic" },
      { title: "Бенто-торт", code: "bentoCake" },
    ],
    images: [
      {
        url: "https://content2.flowwow-images.com/data/flowers/524x524/45/1657556776_5895345.jpg",
      },
      {
        url: "https://cvety.kz/upload/resize_cache/iblock/b07/c9tl1b5o8fz6246nj1vyu5529unu3usp/700_700_1/Izobrazhenie-WhatsApp-2023_08_26-v-20.35.52.jpg",
      },
    ],
  },
  {
    id: "37",
    title: "Гвоздики микс (букет 51 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "carnations", title: "Гвоздики" }],
    price: 39500,
    originalPrice: 46000,
    flowerCount: 51,
    flowerHeight: 50,
    discount: 15,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      {
        url: "https://dari-cvety.com/assets/images/products/1169/buket-iz-51-gvozdik-miks.jpg",
      },
    ],
  },
  {
    id: "38",
    title: "Ранункулюсы белые (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "ranunculus", title: "Ранункулюсы" }],
    price: 29000,
    originalPrice: 32000,
    flowerCount: 21,
    flowerHeight: 55,
    discount: 10,
    features: [{ title: "Экзотические", code: "exotic" }],
    images: [
      { url: "https://venusinfleurs.ru/image/catalog/product/4195/4195_1.jpg" },
    ],
  },
  {
    id: "39",
    title: "Роза микс (букет 21 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "rose", title: "Роза" }],
    price: 27000,
    originalPrice: 30000,
    flowerCount: 21,
    flowerHeight: 60,
    discount: 10,
    features: [
      { code: "fragrant", title: "Ароматные" },
      { title: "Экзотические", code: "exotic" },
    ],
    images: [
      { url: "https://ir-3.ozone.ru/s3/multimedia-7/c1000/6067212547.jpg" },
    ],
  },
  {
    id: "40",
    title: "Лилии красные (букет 11 шт.)",
    categoryRu: "Цветы",
    categoryCode: "flowers",
    bouquetComposition: [{ code: "lilies", title: "Лилии" }],
    price: 17500,
    originalPrice: 19500,
    flowerCount: 11,
    flowerHeight: 60,
    discount: 10,
    features: [{ code: "hypoallergenic", title: "Гипоаллергенные" }],
    images: [
      { url: "https://venusinfleurs.ru/image/catalog/category/428/428_1.jpg" },
    ],
  },
];

async function seedInitialFlowers(businessId, defaultCategoryId) {
  const transaction = await sequelize.transaction();

  try {
    for (const flower of initialFlowers) {
      // 1. Создание товара
      const item = await Item.create({
        title: flower.title,
        businessId,
        categoryId: defaultCategoryId, // передаем сюда ID категории "Цветы" или нужной
        price: flower.price,
      }, { transaction });

      // 2. Создание атрибутов для товара
      const attributeData = [];

      if (flower.bouquetComposition && flower.bouquetComposition.length > 0) {
        attributeData.push({
          itemId: item.id,
          code: "bouquetComposition",
          titleRu: "Состав букета",
          titleKz: "Состав букета",
          dataType: "variantArray",
          value: flower.bouquetComposition,
          categoryId: defaultCategoryId,
          businessId
        });
      }

      if (flower.features && flower.features.length > 0) {
        attributeData.push({
          itemId: item.id,
          code: "features",
          titleRu: "Особенности",
          titleKz: "Особенности",
          dataType: "variantArray",
          value: flower.features,
          categoryId: defaultCategoryId,
          businessId
        });
      }

      if (flower.flowerCount) {
        attributeData.push({
          itemId: item.id,
          code: "flowerCount",
          titleRu: "Количество цветов",
          titleKz: "Количество цветов",
          dataType: "number",
          value: flower.flowerCount,
          categoryId: defaultCategoryId,
          businessId
        });
      }

      if (flower.flowerHeight) {
        attributeData.push({
          itemId: item.id,
          code: "flowerHeight",
          titleRu: "Высота цветов",
          titleKz: "Высота цветов",
          dataType: "number",
          value: flower.flowerHeight,
          categoryId: defaultCategoryId,
          businessId
        });
      }

      if (attributeData.length > 0) {
        await ItemAttribute.bulkCreate(attributeData, { transaction });
      }

      // 3. Обновляем uniqueCategories бизнеса
      const business = await Business.findByPk(businessId, { transaction });
      if (business) {
        let uniqueCategories = business.uniqueCategories || [];
        if (!uniqueCategories.includes(defaultCategoryId)) {
          uniqueCategories.push(defaultCategoryId);
          await business.update({ uniqueCategories }, { transaction });
        }
      }
    }

    await transaction.commit();
    console.log("Initial flowers seeded successfully.");
  } catch (error) {
    await transaction.rollback();
    console.error("Error seeding initial flowers:", error);
  }
}
seedInitialFlowers(1, 2441)