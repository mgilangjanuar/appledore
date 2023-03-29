---
title: How do I Handle Heavy Data Processing in RESTful API
published_at: 2020-07-03T00:00:00.000+07:00
tags:
  - software engineer
  - story
---

As a software engineer, whether a (front or back)-end engineer, we must be familiar with this page. If we use the HTTP as a protocol to make our services to communicate with, we should take the risk of something like this.

![](https://miro.medium.com/max/1082/0*f72iQqk0akRFepPU)

The common problem when a 504 error page appears is when we processing heavy data on the server-side. And it can be worse if we use a single-threaded technology (*yup, it’s you Node.js 🖕*). Here is the journey to find the right solution for this case, I hope.

---

## Phase 1

We used the aggregate function to process the big data calculation on our database. So, the load for it is on the database. We didn’t realize it until the nightmare comes. Yeah, the CPU load of our database is spiking, and make a whole application is slow.

![](https://miro.medium.com/max/1278/0*kUDFviqC-HhOAold)
*Illustration image: [https://leancrew.com/all-this/2013/06/spike/](https://leancrew.com/all-this/2013/06/spike/)*

## Phase 2

OK. Now, we decide to make the calculation on the app-level. So, we get all the data from the database first, then loop the data to get the result and return it as a response of the API. And of course, we use Redis as our cache system.

We got the worst nightmare here. Because of Node.js is run on a single thread, and the heavy processing like that is blocking to other endpoints. Of course, it makes a whole application is terrible sucks.

![](https://miro.medium.com/max/800/0*HxwkwbVhstNl0m9v)

## Phase 3

I found the Asynchronous Request-Reply pattern from here: [https://docs.microsoft.com/en-us/azure/architecture/patterns/async-request-reply](https://docs.microsoft.com/en-us/azure/architecture/patterns/async-request-reply). Very interesting design pattern, especially for my case.

Maybe if my application is only on the server-side, I can use the pub/sub framework with the message queue for communication with each service. But, it needs an interface in web browsers and mobile applications. So, I think the best solution is with that pattern.

![](https://miro.medium.com/max/1400/0*IHwf3ByrpUPDKZB8)
*Asynchronous Request-Reply pattern: [https://docs.microsoft.com/en-us/azure/architecture/patterns/async-request-reply](https://docs.microsoft.com/en-us/azure/architecture/patterns/async-request-reply)*

As in the illustration, the client will hit an endpoint to process the heavy calculation and only respond with 202 status code (Accepted). We can use a worker to process it on the server-side. So, the load on the application will be reduced. Then, check the status of the background job until it complete and the client will get the result in the real resource endpoint.

Don’t forget if the calculation process can throw an error if something shit happens. So, provide the error handler and respond client in the resource endpoint with a proper error message/object.

We can keep using Redis for the results to caching it for the next requests. So, it’s possible the client immediately gets the results in the first hit. We also can use 1–5s for time to live to keep the results in the cache if we want the data near-real time 😂

So, that’s my story (in a production server). *Happy coding!* 🤣