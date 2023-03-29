---
title: Bagaimana Layanan untuk Single Sign-On dan OAuth2 Bekerja
published_at: 2020-10-05T00:00:00.000+07:00
# cover: https://miro.medium.com/max/1400/0*QwyvPvyQvr_Zwncv
tags:
  - software engineer
---

Aspek privasi dan keamanan dalam membangun sebuah perangkat lunak modern kini sudah tidak dapat ditunda lagi. Saat ini semua pengguna sudah semakin cerdas dan sadar mengenai privasi miliknya yang harus dilindungi oleh penyedia layanan yang digunakannya baik itu *e-commerce*, layanan pesan antar, atau bahkan aplikasi pemerintahan. Sehingga, tugas kita sebagai perekayasa perangkat lunak harus memahami dalam memberikan kepercayaan yang meyakinkan pengguna bahwa aplikasi yang kita bangun benar-benar melindungi data miliknya dengan aman.

![](https://miro.medium.com/max/1400/0*QwyvPvyQvr_Zwncv)

---

Sebagai prasyarat, penulis akan mengasumsikan pembaca telah familiar dengan arsitektur *microservice* dan bagaimana komunikasi tiap layanannya bekerja. Untuk lebih memahami secara mendalam mengenai bagaimana komunikasi antar layanan bekerja dalam protokol HTTP khususnya, mungkin tulisan ini dapat membantu.

[Bagaimana HTTP Server Bekerja dan Kaitannya dengan Socket Programming](/#/articles/bagaimana-http-server-bekerja-dan-kaitannya-dengan-socket-programming)

## Pendahuluan

Bahasa.ai telah memiliki banyak layanan yang saling terintegrasi untuk menciptakan manfaat kepada klien terhadap banyak pelanggannya. Seiring perkembangan dunia kecerdasan buatan saat ini maka akan semakin banyak peluang yang dapat diciptakan. Artinya, akan semakin banyak produk yang dibuat di masa depan begitu juga dengan layanan dan integrasinya.

Banyaknya layanan milik Bahasa.ai tanpa disadari pasti akan selalu terintegrasi dengan layanan autentikasi, baik itu yang sudah ada saat ini maupun yang akan datang.

![](https://miro.medium.com/max/1400/1*rhraFQYqbyJmHoQOD9ts2Q.png)

Sebuah layanan vital yang penting dan terpusat untuk melakukan autentikasi dan otorisasi bukanlah hal yang mudah untuk diimplementasikan. Namun, perancangan arsitektur layanan ini bukanlah hal yang baru. Sudah ada standar yang diciptakan untuk hal ini. Sebelumnya, penulis akan mengenalkan istilah yang akan sering digunakan.

1. **Autentikasi**, proses identifikasi pengguna dengan kredensial yang dapat divalidasi.

1. **Otorisasi**, proses yang dilakukan setelah autentikasi untuk mevalidasi pengguna apakah dapat mengakses API terkait hingga dapat meyelesaikan sebuah kasus penggunaan (*use case*) khusus.

1. **Layanan** (atau *service*), bagian dari arsitektur *microservice* yang memiliki fungsi khusus dan spesifik.

1. **Produk**, perangkat lunak atau aplikasi yang dapat dibangun dari satu atau beberapa layanan yang memiliki antarmuka untuk pengguna.

## Tujuan

Adanya layanan autentikasi dan otorisasi ini memiliki manfaat yang sama halnya dengan fungsi dari setiap layanan pada arsitektur *microservice*, tugas layanan ini sangat spesifik untuk melakukan proses autentikasi dan otorisasi tentunya. Tulisan ini bertujuan untuk mengenalkan arsitektur pada layanan tersebut beserta implementasinya pada 2 fungsi penting, yaitu *Single Sign-On* dan OAuth2.

## Single Sign-On

Sadar atau tidak kita pasti sering menggunakan metode ini untuk masuk ke aplikasi atau perangkat lunak dunia maya. Misalnya saja [accounts.google.com](accounts.google.com) yang merupakan *Single Sign-On* (SSO) milik Google. Jika kita menuju Gmail atau Youtube untuk sign in, maka kita akan diarahkan ke laman [accounts.google.com](accounts.google.com) untuk memasukkan kredensial yang sama dan cukup melakukannya sekali saja. Begitu pun ketika kita menuju produk milik Google lainnya, kita tidak perlu memasukkan kata sandi berulang kali, bukan?

Konsep dasar yang dimiliki oleh SSO ini tentu sesuai dengan namanya, yaitu untuk membuat pengguna cukup *sign in* sekali agar dapat masuk ke semua produk terkait. Hal penting yang harus diperhatikan pengguna adalah memastikan bahwa URL pada halaman SSO ini benar dan aman (menggunakan protokol HTTPS). Sehingga ini menjadi tantangan tersendiri untuk pengalaman pengguna produknya agar pengguna merasa aman dan percaya.

## Kapan Single Sign-On Diperlukan?

Perlu atau tidaknya *Single Sign-On* ini tentunya bergantung pada kebutuhan perusahaan. Jika perusahaan hanya mengembangkan satu jenis produk, maka kebutuhan SSO akan kurang bermanfaat atau bahkan tidak berguna.

Seringkali perusahaan atau tim perekayasa perangkat lunak baru sadar akan kebutuhan SSO ini ketika tim produk akan membuat produk lain yang mungkin berbeda kasus penggunaannya dengan produk sebelumnya. Atau jika perusahaan akan melakukan akuisisi terhadap perusahaan lain dan ingin menggabungkan data penggunanya, seperti yang dilakukan oleh Google terhadap Youtube.

## Konsep Dasar

Sebelum membuat layanan SSO, kita harus memahami terlebih dahulu bagaimana proses autentikasi dan otorisasi itu terjadi. Pada arsitektur produk modern, mereka akan menggunakan token otorisasi yang didapatkan dari proses autentikasi. Untuk lebih jelasnya silakan perhatikan alur berikut.

![](https://miro.medium.com/max/1400/1*8uxinR0vwlhDKxt4NHz4_Q.png)

Antarmuka yang digunakan pengguna dapat berupa website yang dibuka menggunakan peramban ataupun aplikasi *mobile*. Lalu, bagaimana perangkat yang digunakan pengguna tersebut dapat menyimpan token otorisasinya? Tentu ada banyak solusi untuk hal ini, salah satunya adalah dengan menggunakan *cookie* ([pranala luar](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)). Cara yang disarankan untuk menyimpannya ke *cookie* peramban adalah dengan memberikan *response header* `Set-Cookie` dari sisi server. Misalnya seperti ini:

```shell
Set-Cookie: token=...; Max-Age=54000; Secure; Path=/; Expires=Sun, 04 Oct 2020 16:31:48 GMT
```

Sehingga saat perangkat akan melakukan request lagi ke *server*, perangkat tersebut — peramban khususnya, akan menambahkan *request header* `Cookie` pada saat *request* tersebut dibuat. Kemudian dari sisi *server* hanya perlu mengambil dan mevalidasinya, itulah yang disebut proses otorisasi.

## Implementasi

Sama halnya dengan halaman *sign in* pada umumnya, fungsi yang ada pada *Single Sign-On* ini adalah untuk *sign in*, *register*, *forgot password*, dan lain lain. Perbedaan mendasarnya adalah pada SSO ini dapat melakukan autentikasi ke banyak produk lainnya, sehingga pengguna tidak perlu melakukan autentikasi berulang untuk setiap produk tersebut.

![](https://miro.medium.com/max/1400/1*k0zHWy-70_10WF_xnyEIxQ.png)

Membuat layanan ini sama halnya seperti membuat sebuah produk. Namun, fungsionalitas yang ada hanyalah berfokus pada autentikasi, otorisasi, atau bahkan autentikasi banyak faktor.

Implementasinya terbilang cukup mudah setelah kita mengetahui konsep dasar dari solusi modern penyimpanan token otorisasi pada *cookie*. Dari laman SSO akan mengirim request ke sisi *server*, melakukan autentikasi, kemudian pada sisi *server* akan mengirimkan *response* berhasil atau tidaknya proses autentikasi tersebut sekaligus mengirimkan `Set-Cookie` pada *response header* jika autentikasi berhasil.

![](https://miro.medium.com/max/1400/1*7gRdRltAktgQ-acVgLAl3w.png)

Hal umum yang perlu diketahui adalah proses pengiriman kembali *request header* `Cookie` ke sisi *server* akan dilakukan oleh domain tujuan beserta seluruh subdomainnya (`*.domain.com`). Sehingga jika produk yang dimiliki ada di subdomain seperti [maps.google.com](maps.google.com), [mail.google.com](mail.google.com), dan lain-lain maka implementasinya akan sama saja seperti proses autentikasi dan otorisasi pada umumnya.

## Bagaimana dengan Produk Beda Domain?

Akan ada sedikit perbedaan dalam proses penyimpanan *cookie* untuk produk yang beda domain. Salah satu solusi yang juga diterapkan oleh Google terhadap Youtube adalah dengan menanamkan domain Youtube ke laman S*ingle Sign-On* milik Google.

![](https://miro.medium.com/max/1400/1*cvCCNl6xCVNy93FHbAjtIA.png)

Cara paling sederhana untuk menanamkannya adalah dengan memanfaatkan tag `<iframe>` domain produk tersebut pada laman *Single Sign-On*. Saat proses autentikasi berhasil dan telah mendapatkan token otorisasi, maka yang perlu dilakukan hanyalah menambahkan cookie token tersebut ke semua produk melalui elemen `<iframe>` tersebut.

Sekian bahasan mengenai konsep *Single Sign-On*. Apa yang penulis jelaskan hanyalah gambaran besar dan konsep penting tentang bagaimana SSO tersebut bekerja. Berikutnya merupakan bahasan yang cukup menarik dan berbeda namun masih merupakan fungsi dari layanan autentikasi.

## OAuth2

Merupakan suatu fitur atau fungsi lain yang menjadi protokol standar industri modern untuk proses otorisasi ([pranala luar](https://oauth.net/2/)). Standar ini dibuat untuk menjadi konvensi yang memudahkan perekayasa perangkat lunak dalam memahami proses otorisasi sebuah produk. Lalu apa yang membedakannya dengan proses otorisasi yang biasa?

![](https://miro.medium.com/max/1400/1*Tn8eALOOBIEPf5Tyadwi4g.png)

OAuth2 digunakan untuk proses autentikasi dan otorisasi oleh produk dari pihak ketiga yang menggunakan layanan autentikasi dari produk lain. Contoh paling sederhana yang mungkin tidak kita sadari adalah fitur `Sign in with Google`, `Sign in with Twitter`, dan lain-lain. Jika kita pernah menggunakan fitur tersebut pada produk yang kita gunakan, maka kita sudah menjadi pengguna dari standar OAuth2 dalam proses otorisasinya.

## Apa Keuntungan OAuth2?

Standar sebuah protokol maupun konvensi dalam pengembangan perangkat lunak tentu diciptakan untuk suatu tujuan khusus. Selain untuk memudahkan perekayasa perangkat lunak dalam memahami proses otorisasi yang aman, tujuan lainnya adalah untuk memudahkan mereka yang mengembangkan aplikasi pihak ketiga dalam mengelola data penggunanya. Sebab dengan menggunakan layanan autentikasi milik perusahaan lain, aplikasi pihak ketiga tersebut tidak perlu menyimpan kredensial milik pengguna ke basis datanya. Tentu yang harus dipastikan adalah perusahaan yang menyediakan layanan tersebut merupakan perusahaan yang jelas dan kredibel.

Dari sisi penyedia layanan autentikasi yang menerapkan standar ini pun memiliki keuntungan, sebab mereka dapat memastikan proses otorisasi tersebut aman dan terpercaya. Begitu juga dari sisi pengunanya, keuntungan yang diperolehnya adalah dengan tidak perlunya mendaftar pada banyak aplikasi dan tentu akan merasa lebih aman bila proses otorisasi tersebut dilakukan oleh perusahaan yang kredibel.

## Alur dan Proses

Sebagai sebuah standar yang telah ditetapkan, tentu alur dan prosesnya sudah ditentukan dengan tepat. Berikut gambaran proses otorisasi OAuth2.

![](https://miro.medium.com/max/1400/1*sGC_q7eoMONY7_8R9lgxCw.png)

Berdasarkan ilustrasi tersebut, seperti inilah kurang lebih proses OAuth2 terjadi:

1. Pengguna akan diarahkan ke layanan penyedia autentikasi.

1. Pengguna akan memasukkan kredensial ke layanan tersebut.

1. Layanan penyedia akan memberikan detail dari layanan pihak ketiga berupa data atau proses apa saja yang dapat dilakukannya dan meminta otorisasi kepada pengguna.

1. Jika pengguna setuju, layanan penyedia tersebut akan melakukan otorisasi ke aplikasi pihak ketiga.

1. Layanan penyedia akan mengarahkan pengguna kembali ke aplikasi pihak ketiga beserta sebuah kode.

1. Pihak ketiga akan menukarkan kode tersebut ke layanan penyedia dengan token otorisasi.

1. Layanan penyedia memberikan token otorisasi.

1. Pengguna mulai dapat menggunakan aplikasi pihak ketiga menggunakan token otorisasi tersebut.

Biasanya aplikasi pihak ketiga akan mendefinisikan cangkupan yang bisa dilakukan oleh aplikasi tersebut kepada layanan penyedia. Misalnya seperti mengakses layanan lain yang ada pada ekosistem layanan penyedia tersebut. Sehingga layanan penyedia dapat melakukan otorisasi terhadap pengguna yang akan mengakses layanan penyedia melalui aplikasi pihak ketiga.

Hal yang sangat mencirikhaskan OAuth2 adalah dengan adanya kode yang diarahkan dari layanan penyedia ke aplikasi pihak ketiga. Tentunya kode tersebut bukanlah token otorisasi yang dapat digunakan langsung. Namun, dapat ditukar dengan cara melempar kembali kode tersebut ke sebuah API autentikasi milik layanan penyedia. Setelah itu, aplikasi pihak ketiga akan mendapatkan token otorisasi yang dapat digunakan untuk mengakses layanan yang sesuai dengan cangkupannya.

## Kasus Khusus

Dalam beberapa kasus, aplikasi pihak ketiga terkadang telah memberikan identitas terhadap penggunanya dengan kode unik yang tidak melibatkan layanan penyedia. Sehingga setelah layanan penyedia melakukan otorisasi dan memberikan kode ke aplikasi pihak ketiga, aplikasi tersebut dapat mengenali penggunanya yang telah terotorisasi.

Solusi yang baik dari kasus tersebut adalah dengan menambahkan parameter `state` pada URL yang mengarahkan pengguna ke layanan penyedia saat proses autentikasi. Kemudian yang dilakukan oleh layanan penyedia hanya perlu mengembalikan parameter tersebut ke aplikasi pihak ketiga setelah pengguna setuju untuk mengotorisasi aplikasi tersebut.

![](https://miro.medium.com/max/1400/1*cQncQOPAx8LGDWKEBnWxDg.png)

Berdasarkan ilustrasi tersebut berikut contoh URL untuk mengarahkan pengguna ke layanan penyedia autentikasi:

```shell
https://provider.com?clientId=abc123&state=xxx
```

Parameter `state` inilah yang menjadi penanda bagi aplikasi pihak ketiga terhadap penggunanya. Sehingga setelah proses ke-3 dilakukan, aplikasi tersebut dapat mengenali pengguna yang telah terotorisasi oleh layanan penyedia dengan mudah. Namun, parameter tersebut tidak hanya dapat digunakan untuk pengenalan pengguna saja. Kita dapat menggunakaanya juga sebagai penanda session, waktu kapan pengguna diarahkan ke layanan penyedia, kode verifikasi yang menandakan bahwa itu benar berasal dari aplikasi pihak ketiga, dan lain-lain.

## Tipe Autentikasi pada OAuth2

Seperti yang telah kita pahami bersama, standar OAuth2 mengizinkan layanan pihak ketiga untuk melakukan autentikasi dengan kode yang diberikannya setelah pengguna setuju untuk terotorisasi. Dampaknya adalah sebagai layanan penyedia autentikasi harus menyiapkan metode autentikasi yang tepat untuk aplikasi pihak ketiga tersebut.

Umumnya setiap klien dari layanan pihak ketiga akan mendapatkan dua buah kode pengenal, *client* ID dan *client secret*. *Client* ID digunakan untuk mengenal layanan pihak ketiga sedangkan *client secret* banyak digunakan untuk proses autentikasinya. Setidaknya perlu ada 4 tipe autentikasi yang harus disiapkan oleh layanan penyedia.

 - **Tipe kata sandi**

    Metode autentikasi dengan tipe ini merupakan metode autentikasi yang biasa. Pengguna dapat langsung melakukan *request* dengan kredensial miliknya untuk mendapatkan kode otorisasi ke layanan penyedia. Namun, tetap harus menyertakan *client* ID untuk mengenal dari mana pengguna tersebut berasal. Seperti inilah contoh *request*-nya.

    ```shell
    curl --location --request POST 'https://provider.com/requestToken' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "grantType": "password",
        "username": "gilang",
        "password": "pssttt...",
        "clientId": "c870cebd-f601-xxx"
    }'
    ```

 - **Tipe kode otorisasi**

    Tipe inilah yang digunakan oleh aplikasi pihak ketiga untuk mengautentikasi pengguna setelah layanan penyedia memberikan kode otorisasi ke aplikasi pihak ketiga tersebut. Biasanya ada beberapa layanan yang juga harus menyertakan cangkupan dan URL pengalihan milik klien ke layanan penyedia saat proses autentikasinya. Namun, minimal seperti inilah *request* yang harus diberikan layanan pihak ketiga kepada layanan penyedia.

    ```shell
    curl --location --request POST 'https://provider.com/requestToken' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "grantType": "authorizationCode",
        "authorizationCode": "4/iKJNmaU89OoLKAlQ",
        "clientSecret": "BANAabn5bmba1.HXX...",
        "clientId": "c870cebd-f601-xxx"
    }'
    ```

 - **Tipe *refresh token***

    Proses autentikasi dengan *refresh token* bukanlah hal yang baru. Biasanya layanan penyedia akan memberikan token ini bersama dengan token akses setelah proses autentikasi berhasil. Fungsinya adalah untuk menjaga pengguna agar selalu terautentikasi sehingga tidak perlu memasukkan *username* dan kata sandi berulang kali. Untuk melakukan hal tersebut, yang perlu dilakukan oleh layanan pihak ketiga hanyalah menyimpan *refresh token* pengguna pada basis datanya dan memberikan *request* ke layanan penyedia seperti ini kemudian akan mendapatkan token akses yang baru untuk proses otorisasi berikutnya.

    ```shell
    curl --location --request POST 'https://provider.com/requestToken' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "grantType": "refreshToken",
        "refreshToken": "4/iKJNmaU89OoLKAlQ",
        "clientSecret": "BANAabn5bmba1.HXX...",
        "clientId": "c870cebd-f601-xxx"
    }'
    ```

 - **Tipe kredensial klien**

    Tipe ini memang jarang digunakan pada metode autentikasi pada umumnya karena token akses yang didapat pada metode ini tidak terikat pada seorang pengguna manapun. Metode ini biasanya dilakukan oleh layanan pihak ketiga dalam melakukan proses khusus yang tidak melibatkan pengguna seperti mengetahui cangkupan yang tersedia, dokumentasi API, dan lain-lain milik layanan penyedia. Kurang lebih seperti inilah bentuk *request*-nya.

    ```shell
    curl --location --request POST 'https://provider.com/requestToken' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "grantType": "clientCredential",
        "clientSecret": "BANAabn5bmba1.HXX...",
        "clientId": "c870cebd-f601-xxx"
    }'
    ```

## Pertimbangan Keamanan

Penting untuk diketahui bahwa layanan pihak ketiga tidak boleh menyimpan kredensial pengguna pada basis datanya. Mungkin untuk kebutuhan fitur pada layanannya yang membutuhkan *email* atau nama pengguna ini masih diperbolehkan karena pengguna sadar bahwa aplikasi tersebut membutuhkan data dirinya untuk menjalankan fitur tersebut.

Selain itu layanan pihak ketiga juga tidak boleh menyimpan *client secret* pada sisi pengguna seperti di peramban misalnya. Sebab hal tersebut sangat riskan untuk diambil oleh orang lain dan dapat dimanfaatkan utuk mencuri identitas milik pengguna aslinya. Selain itu, dari sisi layanan penyedia dan pihak ketiga pun tidak dapat benar-benar memastikan bahwa aplikasi-aplikasi yang terpasang pada perangkat pengguna aman atau tidak.

## Ringkasan

*Single Sign-On* dan OAuth2 merupakan dua konsep yang berbeda. Kapan kita harus menggunakan SSO adalah ketika kita memiliki banyak produk pada ekosistem milik perusahaan. Lain halnya dengan OAuth2, standar tersebut dibuat ketika kita mengizinkan aplikasi pihak ketiga terhubung dengan layanan yang ada pada ekosistem kita.

Berbeda juga halnya dengan proses autentikasi dan otorisasi. Kedua fungsi tersebut haruslah tersedia pada arsitektur yang kita bangun. Mungkin masih ada yang menggabungkan kedua proses tersebut pada produk utama. Namun bila kita menerapkan arsitektur *microservice* pada produk yang kita bangun, maka sudah seharusnya ada layanan yang menangani kedua proses tersebut secara khusus.

Perbedaan pada proses autentikasi dan otorisasi ini dapat dianalogikan seperti saat kita pergi ke sebuah bank. Saat kita akan masuk, petugas keamanan akan memeriksa kita apakah kita bisa masuk ke dalam atau tidak. Proses inilah yang disebut autentikasi. Setelah kita masuk ke dalam bank dan berhadapan dengan teller, tentu kita hanya diizinkan melakukan beberapa hal saja. Seperti melakukan transfer dari rekening kita ke rekening milik orang lain, bukan sebaliknya. Kemudian teller akan memeriksa apakah nomor rekening tujuan valid atau tidak, saldo pada rekening kita mencukupi atau tidak, dan seterusnya. Konsep inilah yang mirip seperti proses otorisasi.

## Bacaan Lebih Lanjut

 - [https://securityboulevard.com/2020/06/authentication-vs-authorization-defined-whats-the-difference-infographic/#:~:text=In%20other%20words%2C%20authentication%20is,from%20breaches%20and%20unauthorized%20access](https://securityboulevard.com/2020/06/authentication-vs-authorization-defined-whats-the-difference-infographic/#:~:text=In%20other%20words%2C%20authentication%20is,from%20breaches%20and%20unauthorized%20access)

 - [https://stackoverflow.com/questions/4113934/how-is-oauth-2-different-from-oauth-1c](https://stackoverflow.com/questions/4113934/how-is-oauth-2-different-from-oauth-1c)

 - [https://oauth.net/2/](https://oauth.net/2/)