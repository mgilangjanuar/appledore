---
title: Bagaimana HTTP Server Bekerja dan Kaitannya dengan Socket Programming
published_at: 2018-01-30T00:00:00.000+07:00
tags:
  - programming
  - software engineer
---

Sebagai *web enthusiast*, pernahkah terpikirkan bagaimana suatu halaman *web* dapat dilihat langsung menggunakan browser di IP dan *port* tertentu?

Baru-baru ini saya juga mendapatkan pengalaman dan pembelajaran yang cukup menarik terkait topik tersebut di kelas *Distribution Systems* di Fasilkom. Tantangan yang diberikan adalah harus membuat *web server* tanpa menggunakan *library* yang telah ada. Kemudian hanya dengan konsep pemrograman *socket*, *web server* tersebut berhasil dibuat. Mengapa hal tersebut bisa terjadi?

## Socket Programming

Dengan menggunakan *socket* kita dapat mengirim atau menerima data antar IP dan *port* tertentu. Mulanya *server* akan melakukan binding terhadap IP dan *port* miliknya kemudian akan melakukan listen dan menunggu hingga *client* terhubung. Setelah *client* terhubung, *server* dan *client* pun dapat berkomunikasi dengan melakukan proses *read* dan *write*. Dari konsep yang sederhana ini lah *web server* dapat dibangun.

Berikut potongan source code untuk socket programming dengan Python 3 *(diadaptasi dari [https://www.tutorialspoint.com/python/python_networking.htm](https://www.tutorialspoint.com/python/python_networking.htm) dengan perubahan)*.

`server.py`

```python
import socket

s = socket.socket()
s.bind((socket.gethostname(), 8088))

s.listen(5)
while True:
   c, addr = s.accept()
   print('Got connection from', addr)
   c.send('Thank you for connecting'.encode('utf-8'))
   c.close()
```

`client.py`

```python
import socket

s = socket.socket()
s.connect((socket.gethostname(), 8088))
print(s.recv(1024).decode('utf-8'))
s.close
```

Kemudian jalankan server.py dengan perintah `python server.py` dan jalankan client.py di terminal yang berbeda dengan perintah `python client.py`. Ketika client terhubung atau sedang dijalankan, pada terminal *server* akan muncul string *“Got connection from (‘192.168.100.xx’, xxxxx)”* yang menunjukkan alamat dari si client. Dan pada terminal client akan muncul string *“Thank you for connecting”* yang dikirim dari si *server*.

## HTTP/1.1

HTTP merupakan *protocol* khusus yang digunakan untuk melakukan transfer data yang berupa *hypertext* sehingga bisa kita lihat melalui *browser* seperti saat ini. Salah satu tipe dokumen yang dapat dirender dengan baik melalui *protocol* ini adalah HTML (*HyperText Markup Language*).

Meskipun saat ini sudah ada versi HTTP/2 yang dapat melakukan pemanggilan *asynchronous* untuk setiap *request*-nya namun HTTP/1.1 masih cukup banyak digunakan.

Berikut adalah salah satu contoh dari HTTP/1.1 request dan reponse.

**Request Example**

```shell
POST / HTTP/1.1
Host: localhost:8088
User-Agent: curl/7.54.0
Accept: */*
Content-Length: 16
Content-Type: application/x-www-form-urlencoded

{'data': 'test'}
```

**Response Example**

```shell
HTTP/1.1 200 OK
Content-Type: application/json
Connection: close

{"ping": 1}
```

Untuk mempelajari dan mengetahui lebih lanjut mengenai format dari *request* dan *response* milik HTTP/1.1 dapat dilihat di [https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html) dan [https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html)

## Send HTTP/1.1 Response Through Socket

Untuk memperjelas kembali, *request* adalah data yang ditransfer dari *client* ke *server* melalui (salah satunya) *form* dan response adalah yang ditransfer dari *server* ke *client* yang dapat berupa HTML, JSON, *plain text*, *image*, dan lain-lain.

*Client* yang dimaksud di sini tentu adalah *web browser* seperti Firefox, Chrome, Internet Explorer dan lain-lain. Sedangkan *server* adalah yang akan kita kembangkan dengan *socket programming*.

Untuk membangun *web server* yang kita butuhkan adalah sedikit perbaikan dari `server.py` menjadi seperti ini.

```python
import socket
s = socket.socket()
s.bind(('127.0.0.1', 8088))

s.listen(5)
while True:
   c, addr = s.accept()
   request = c.recv(1024).decode('utf-8')
   # print(request)

   message = ("HTTP/1.1 200 OK\n"
        "Content-Type: application/json\n"
        "Connection: close\n\n"
        "{\"ping\": 1}\n")

   c.send(message.encode('utf-8'))
   c.close()
```

Jika *variable request* dicetak maka akan terlihat format HTTP/1.1 *request* dari *client* seperti pada *section* sebelumnya.

Silakan jalankan program tersebut dengan Python 3 dan buka URL [http://localhost:8088](http://localhost:8088) menggunakan *web browser* atau gunakan program *curl* dengan perintah `curl localhost:8088` (berdasarkan IP dan *port* yang di-*binding*). Maka akan tampil *response* dari *server* dengan format json.

```shell
{"ping": 1}
```

Potongan kode sumber tersebut hanyalah contoh sederhana dari proses pengiriman HTTP/1.1 *response*. Silakan memahami dan bereksperimen lebih lanjut dengan mengubah *response message* dan mengubah *request* dari *client*.

---

Menarik bukan? Jika selama ini kita hanya menggunakan XAMPP atau menggunakan *library web server* lainnya, setelah mengetahui hal ini kita bisa juga lho membangun *web server* sendiri. Saya juga telah mengembangkannya dari *scratch* dengan Python di [https://github.com/mgilangjanuar/py-simple-http-server](https://github.com/mgilangjanuar/py-simple-http-server) saat kelas *Distributed Systems* tersebut berlangsung. Silakan fork dan buat perbaikan atau *improvement* untuk pembelajaran bersama.