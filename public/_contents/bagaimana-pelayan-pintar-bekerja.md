---
title: Bagaimana Pelayan Pintar Bekerja
published_at: 2021-01-21T00:00:00.000+07:00
tags:
  - software engineer
  - story
---

Pelayan pintar adalah *chatbot* WhatsApp yang kami kembangkan di Bahasa.ai menggunakan perangkat IoT. Bagaimana AI kami bekerja pada perangkat tersebut?

![](https://miro.medium.com/max/1400/1*Bvvmubwwk5foDX3Zuqgv8g.png)

---

## Persiapan

Langkah awalnya kita perlu menyiapkan aplikasi *mobile* dan *cloud environment* pada [Tuya *platform*](https://iot.tuya.com/). Agar aplikasi yang dibuat dapat langsung di-*install* kita perlu membuatnya menjadi *OEM app*, selanjutnya hanya perlu melakukan kustomisasi seperlunya.

![](https://miro.medium.com/max/1400/1*V5NKvYPR4RTYkYDkpNdXQQ.png)

Setelah *install* aplikasi tersebut pada *smartphone* kita, kita perlu menambahkan atau menghubungkan perangkat IoT yang telah kita miliki ke aplikasi tersebut. Selanjutnya, buatlah cloud dan hubungkan aplikasi kita ke cloud tersebut melalui menu *link devices by Apps*.

![](https://miro.medium.com/max/1400/1*jbK-63usRDzIo17cCpAG6w.png)

Ketika semuanya sudah dipersiapkan, yang perlu kita catat sebagai “kunci” untuk disimpan pada *environment variable* mesin kita adalah *client* id dan *client secret* pada *cloud* dan *schema* pada aplikasi yang telah dibuat.

## Services

*Service* atau layanan utama pada chatbot ini adalah HTTP *request* yang digunakan untuk mengirim perintah ke perangkat IoT. Kami menggunakan produk dari [Tuya](https://www.tuya.com/) sehingga perlu menyiapkan *environtment*-nya terlebih dahulu berikut langkah-langkahnya: [Quick Start](https://developer.tuya.com/en/docs/iot/open-api/quick-start/quick-start1?id=K95ztz9u9t89n). Selanjutnya hanya perlu melakukan wrappin*g terhadap API yang kita perlukan dari Tuya cloud ([API list](https://developer.tuya.com/en/docs/iot/open-api/api-reference/api-list/api?id=K989ru6gtvspg)) agar mudah digunakan saat *development*.

![](https://miro.medium.com/max/1400/0*ElQTwn-i7Wr_6JRr)

Beberapa layanan pendukung lainnya adalah *internal service*, *email sender*, dan *cache* tentunya.

## Sinkronisasi Pengguna

Untuk menghubungkan pengguna dengan WhatsApp, kita perlu melakukan *mapping* nomor WhatsApp pengguna dengan akunnya yang telah terdaftar melalui aplikasi tersebut. Beruntungnya, Tuya telah menyediakan sebuah API untuk mendapatkan pengguna dari *username*-nya. Jadi, yang perlu kita tanyakan ke pengguna saat pertama kali *chat* ke *chatbot* adalah *username* yang digunakan pada aplikasinya.

![](https://miro.medium.com/max/1400/1*r0HHYYGqBAX1q0gxrFo87Q.png)

Pada dokumentasi user management API milik Tuya tidak ditulis secara lengkap pada bagian *request* parameter. Pada bagian itu, sebenarnya kita bisa menambahkan parameter *username* pada URL (*misal, https://xxxxxx.xxx?username=gilang@bahasa.ai*).

Untuk membuktikan pengguna dengan *username* tersebut adalah pengguna yang valid, kita perlu melakukan validasi terhadapnya melalui *email*. Pada hal ini saya menggunakan proses OTP (*One-Time Password*) untuk mevalidasinya. Kurang lebih seperti ini prosesnya.

![](https://miro.medium.com/max/1400/1*IWLq_rCtCmqJHgjFx40pUw.png)

Tahap pertama saat ditanya *email* tentu kita perlu melihatnya dulu apakah pengguna ini benar memiliki akun pada aplikasi yang telah kita buat atau tidak. Jika ada maka buat kode OTP, disimpan, dan dikirim ke *email*-nya. Jika tidak maka berikan informasi yang jelas bahwa *username* tersebut tidak ditemukan.

![](https://miro.medium.com/max/1400/1*n1k3gVJKmM8K7JPKLn37ag.png)

Tahap berikutnya, *chatbot* hanya perlu memeriksa kode OTP yang dimasukkan oleh pengguna sama dengan kode yang telah dibuat pada tahap sebelumnya.

![](https://miro.medium.com/max/1400/1*yq-0CLvR1xta3we3a9c1Fw.png)

Di sinilah AI engine milik Bahasa.ai bekerja dengan sangat baik. AI kami mampu membedakan perangkat mana yang perlu dioperasikan dan mampu bekerja seperti manusia dalam memahami perintah dari penggunanya.

Selain itu, kami juga membuatnya dapat memahami konteks percakapan yang sedang berlangsung sehingga saat pengguna mengatakan *“terangin dong”* atau *“atur brightness jadi 15%”*, engine kami dapat mengetahui bahwa perintah tersebut untuk sebuah perangkat lampu.

Selanjutnya hanya perlu membuat request ke Tuya API ([pranala luar](https://developer.tuya.com/en/docs/iot/open-api/api-reference/api-list/device-control?id=K95zu01ksols7#title-26-Send%20instructions%20to%20the%20device)).

![](https://miro.medium.com/max/1400/1*oACZDIAqHiUr5oxVtoCjSQ.png)

## Perintah Tambahan

Selayaknya seorang pelayan, tentu kita bisa mengajarkan perintah lain yang kita inginkan. Ide ini benar-benar berasal dari cara kita memerintahkan seorang asisten rumah tangga dalam menjalankan tugasnya. Beruntungnya, AI kami juga mampu melakukan klasifikasi yang tepat untuk dipahami sehingga proses development cukup mudah dilakukan.

![](https://miro.medium.com/max/1400/0*tiT1Dbe8AoYtOGeR)

Setelah perintah dibuat seperti pada gambar, pengguna dapat langsung mengatakan* “cas laptop”* atau *“tolong casin laptop gua dong”* untuk menyalakan stopkontak yang ke-4. Dan seterusnya seperti memberikan perintah pada perangkat biasa di tahap sebelumnya.

---

Sekian eksperimen yang kami lakukan dalam mengombinasikan kemampuan AI *engine* kami dengan teknologi IoT. Sayangnya tidak semua hal dapat kita berikan di blog ini karena mencangkup *internal knowledge* milik Bahasa.ai. Namun, jika ingin mengetahui lebih lanjut mengenai bagaimana AI kami dapat bekerja dengan baik untuk kasus ini, kami sedang mencari *Software Engineer* yang tertarik untuk bergabung bersama kami menemukan hal baru dan berdiskusi bersama. Silakan kirimkan CV terbaru kalian ke [work@bahasa.ai](mailto:work@bahasa.ai) 😃 🚀