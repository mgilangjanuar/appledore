---
title: Mengenal Konsep Kode Bersih
published_at: 2021-02-22T00:00:00.000+07:00
tags:
  - software engineer
---

*Clean code* (kode bersih) sangat membantu rekan dalam tim perekayasa perangkat lunak dalam memelihara produk yang dibuatnya. Penulis akan menjelaskan konsepnya secara umum dan studi kasusnya secara spesifik serta bagaimana tim Bahasa.ai menjaga kualitas kode sumber yang dibuatnya.

![](https://miro.medium.com/max/1400/0*WC37Gz8yLwpyZFyS)

Sebagai seorang perekeyasa perangkat lunak, membuat program yang berjalan dengan benar dan efisien dari segi waktu dan memori pasti sudah menjadi kewajibannya. Namun, dalam aspek kerapihan dan konsistensi dalam penulisan terkadang menjadi hal lain yang sering diabaikan.

Masalah yang muncul dikemudian hari adalah bila sebuah perusahaan atau tim akan merekrut anggota baru yang bertugas melanjutkan produk yang telah dikembangkan sebelumnya. Tentu pekerjaannya akan sedikit terhambat karena tidak adanya dokumentasi yang jelas atau penulisan kode sumber yang tidak sesuai konvensi.

Di sinilah pentingnya kode bersih (*clean code*) pada program yang kita buat. Meskipun aplikasi kita dapat berjalan dengan baik dan lulus kompilasi, keterbacaan dan kesesuaian dengan konvensi sangatlah diperlukan untuk pemeliharaannya.

## DRY

*Don’t Repeat Yourself*. Sebuah fungsi atau metode yang ditulis berulang selain tidak efisien juga pasti tidak rapih dalam penulisannya. Misalnya ada sebuah aksi untuk menyimpan ke basis data dan aksi tersebut memiliki fungsi yang mirip namun berada di modul yang berbeda seperti pada gambar di bawah ini.

![](https://miro.medium.com/max/1082/1*olBOdvgzoNtijHS08qgyYQ.png)

Alangkah indahnya bila fungsi tersebut disatukan dan dibuat di modul lain misalnya pada modul `common` atau `utils` seperti di bawah ini.

![](https://miro.medium.com/max/1158/1*DLdn0U5kN1raXf_8Ba3uUA.png)

Konsep DRY ini juga menganjurkan kita untuk mengurangi redundansi pada keseluruhan produk atau proyek pada satu perusahaan atau organisasi. Untuk itu kita dapat memanfaatkan *package manager* atau *dependency* pada teknologi yang kita gunakan. Misalnya pada Node.js kita dapat membuat *dependency* untuk mengambil, menyimpan, menghapus, dan membarui data yang sering digunakan pada setiap layanan. Dan selalu biasakan untuk mencarinya terlebih dahulu di [https://www.npmjs.com](https://www.npmjs.com) sebelum membuat solusinya sendiri.

## KISS

*Keep It Simple, Stupid*. Tidak menyusahkan diri sendiri adalah bagian penting dari konsep ini. Banyak teknologi yang sudah menyiapkan *built-in* modul yang sangat berguna dan dapat langsung kita gunakan, pelajarilah dan jangan ragu untuk membaca dokumentasinya.

Misalnya kita memiliki sebuah fungsi perkalian menggunakan perulangan seperti pada gambar di bawah ini. Seseorang yang membuatnya mungkin sedang dalam *technical interview* sebuah perusahaan rintisan atau mungkin tidak memahami fungsi matematika `*`.

![](https://miro.medium.com/max/1164/1*eBGC0Q8EULNxkqLz5Nnrsg.png)

Contoh tersebut mungkin jarang ditemukan pada kode sumber manapun. Namun, ada banyak contoh lainnya yang tidak memerhatikan keterbacaan dan tidak menyederhanakan kode yang ditulisnya. Sehingga kita harus konsisten dan fokus saat saling meninjau kode yang kita tulis dengan rekan dalam tim atau yang biasa disebut *code review*.

Pada *Node.js* ada banyak high order function yang dapat kita manfaatkan untuk menyederhanakan kode yang kita tulis. Misalnya ada `map()` untuk mengubah array menjadi *array* baru yang memiliki nilai berbeda, atau `filter()` untuk menyaring nilai pada *array* berdasarkan kriteria tertentu, dan lain-lainnya.

## Follow Code Conventions

Setiap teknologi pasti memiliki konvensinya masing-masing. Misalnya pada penamaan sebuah *class* untuk Java yang harus *PascalCase* dan harus *dromedaryCase* untuk variabelnya. Konvensi yang diciptakan ini bukanlah tanpa tujuan, melainkan untuk memudahkan orang lain dalam memahami kode yang kita tulis.

Sayangnya, ada beberapa konvensi pada teknologi tertentu yang membebaskan pemrogram atau timnya untuk menentukannya sendiri. Khususnya pada *Node.js* dan *Typescript*, misalnya pada penggunaan titik koma (`;`) yang tidak diwajibkan untuk ditulis, atau gaya penamaan variabel dan fungsi yang dibebaskan ke pemrogramnya, dan lain-lainnya. Hal inilah yang harus diperhatikan oleh organisasi atau perusahaan agar konsistensi dalam penulisan kode terjaga dan memudahkan pemeliharaannya di kemudian hari.

Lalu bagaimana tim di Bahasa.ai menjaga hal tersebut?

Kami menggunakan *Typescript* pada banyak produk yang kami ciptakan. Selain karena *“strict”* dalam menjaga konsistensi tipe data yang dimilikinya, teknologi ini memiliki komunitas yang besar dan pengembangannya yang pesat. Tentu dengan kelemahan yang telah disebutkan, kami ingin kode sumber yang kami miliki terjaga dari segi konsistensi pada konvensi untuk semua layanan yang kami miliki. Kami juga sadar bahwa untuk menjaga konsistensi pada konvensi dan keterbacaan kode yang kami tulis tidak dapat hanya mengandalkan code review. Sehingga kami membuat aturan sendiri dengan *linter*.

*Linter* adalah alat untuk membuat aturan-aturan sehingga menjadi konvensi dan untuk mendeteksi error atau warning secara dini pada program sebelum kompilasi. Mungkin waktu yang diperlukan untuk kompilasi menjadi sedikit bertambah karena harus melakukan pemeriksaan dengan *linter*. Namun, demi sebuah pemeliharaan yang baik di masa depan tentu ada harga yang harus dibayar.

Berikut konvensi yang kami buat di Bahasa.ai dengan *Typescript*.

```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'format': ['camelCase', 'UPPER_CASE', 'PascalCase'],
        'leadingUnderscore': 'allow'
      },
      {
        'selector': 'typeLike',
        'format': ['PascalCase']
      }
    ],
    '@typescript-eslint/indent': [
      'error',
      2
    ],
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        'avoidEscape': true
      }
    ],
    '@typescript-eslint/semi': [
      'error',
      'never'
    ],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'comma',
          'requireLast': false
        },
        'singleline': {
          'delimiter': 'comma',
          'requireLast': false
        }
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'args': 'all',
        'varsIgnorePattern': '^\_.*$',
        'argsIgnorePattern': '^\_.*$',
      }
    ],
    '@typescript-eslint/no-extra-parens': 'error',
    '@typescript-eslint/brace-style': 'error',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-null/no-null': 'off',
    'no-useless-escape': 'off',
    'no-trailing-spaces': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'spaced-comment': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        'named': 'never',
        'anonymous': 'always',
        'asyncArrow': 'always'
      }
    ],
    '@typescript-eslint/no-var-requires': 'off'
  }
}
```

Dan inilah *Typescript config* yang kami gunakan sebagai aturan dalam proses kompilasi *Typescript* menjadi *Javascript*.

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "lib": ["es5", "es6", "es2017", "dom"],
    "types": ["reflect-metadata", "node"],
    "noImplicitAny": false,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "removeComments": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "baseUrl": ".",
    "outDir": "dist",
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "exclude": [
    "tests",
    "node_modules",
    "dist"
  ]
}
```

Silakan gunakan `.eslintrc.js` dan `tsconfig.json` tersebut pada proyek atau produk yang sedang kalian kembangkan. Kami juga sangat terbuka pada saran dan pembaruan untuk konvensi tersebut. Terima kasih!

## Bacaan Lebih Lanjut

 - [What is Clean Code ? | Gary Woodfine](https://garywoodfine.com/what-is-clean-code/#:~:text=Clean%20code%20is%20code%20that,understand%20and%20easy%20to%20change.&text=Following%20that%20defintion%2C%20absolutely%20any,be%20classed%20as%20clean%20code.)
 - [Clean Code Explained — A Practical Introduction to Clean Coding for Beginners (freecodecamp.org)](https://www.freecodecamp.org/news/clean-coding-for-beginners/)
 - [TypeScript: Documentation — Do’s and Don’ts (typescriptlang.org)](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)