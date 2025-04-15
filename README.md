<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/BbayuGt/Trakteer.js">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

<h3 align="center">Trakteer.js</h3>

  <p align="center">
    Unofficial trakteer client
    <br />
    <a href="https://github.com/BbayuGt/Trakteer.js"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/BbayuGt/Trakteer.js">View Demo</a>
    ·
    <a href="https://github.com/BbayuGt/Trakteer.js/issues">Report Bug</a>
    ·
    <a href="https://github.com/BbayuGt/Trakteer.js/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#getting-blocked-by-cloudflare">Getting Blocked by Cloudflare?</a></li>
    <li><a href="#legal">Legal</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Unofficial Trakteer Streaming API (Using websocket)

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Typescript][Typescript]][Typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use Trakteer.js and how to install them.

- npm
  ```sh
  npm install trakteerjs@latest
  ```

<!-- USAGE EXAMPLES -->

## Usage

_For examples, please refer to the [Examples](https://github.com/BbayuGt/Trakteer.js/tree/main/examples)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Documentation -->

## Documentation

- [Trakteer.js Documentation](https://bbayugt.github.io/Trakteer.js/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Features

- Public API

| Features            | Implemented? | How to use it           |
| ------------------- | ------------ | ----------------------- |
| Quantity Given      | Yes          | `.quantityGiven(email)` |
| Support History     | Yes          | `.supportHistory()`     |
| Current Balance     | Yes          | `.currentBalance()`     |
| Transaction History | Yes          | `.transactionHistory()` |

- Stream API

| Features      | Implemented? | How to use it                       |
| ------------- | ------------ | ----------------------------------- |
| Live Donation | Yes          | `.on("donation", (donation) => {})` |
| Leaderboard   | Yes          | `.getLeaderboard()`                 |
| Get Goal      | Yes          | `.getGoal()`                        |
| Get Supporter | Yes          | `.getSupporter()`                   |

- Payment API

| Features              | Implemented?       | How to use it                 |
| --------------------- | ------------------ | ----------------------------- |
| Get payment methods   | Yes                | `.getPaymentMethods(creatorId, paymentMethod, amount, config)`        |
| Get total amount      | Yes                | `.getTotalAmount(paymentMethod, amount, is_payment_fee_by_supporter)`           |
| Create payment        | Yes                | `.createPayment(creatorId, paymentMethod, amount, config)`            |

See the [API Documentation](https://bbayugt.github.io/Trakteer.js/) for more details. (Some features probably not listed here.)
See the [open issues](https://github.com/BbayuGt/Trakteer.js/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the APACHE 2.0 + DNH License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

BbayuGt - [@BbayuGt](https://twitter.com/BbayuGt) - bbayugt@proton.me

Discord - @bbayugt

Project Link: [https://github.com/BbayuGt/Trakteer.js](https://github.com/BbayuGt/Trakteer.js)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting blocked by Cloudflare?

Some Server Provider may be blocked by Cloudflare, if you get blocked, please join the [Official Trakteer Discord Server](https://discord.gg/GE5BR2EtBV) and open a ticket, trakteer moderator will help from there

## Legal

> Trakteer.js is NOT affiliated with, maintained, sponsored or endorsed by Trakteer or any of its affiliates. Use at your own risk!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/BbayuGt/Trakteer.js.svg?style=for-the-badge
[contributors-url]: https://github.com/BbayuGt/Trakteer.js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/BbayuGt/Trakteer.js.svg?style=for-the-badge
[forks-url]: https://github.com/BbayuGt/Trakteer.js/network/members
[stars-shield]: https://img.shields.io/github/stars/BbayuGt/Trakteer.js.svg?style=for-the-badge
[stars-url]: https://github.com/BbayuGt/Trakteer.js/stargazers
[issues-shield]: https://img.shields.io/github/issues/BbayuGt/Trakteer.js.svg?style=for-the-badge
[issues-url]: https://github.com/BbayuGt/Trakteer.js/issues
[license-shield]: https://img.shields.io/github/license/BbayuGt/Trakteer.js.svg?style=for-the-badge
[license-url]: https://github.com/BbayuGt/Trakteer.js/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[Typescript]: https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
