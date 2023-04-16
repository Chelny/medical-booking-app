<a name="readme-top"></a>

<div align="center">
  <img src="public/assets/images/icons/logo.png" alt="Medical Booking App" width="200">
  <br>
  <h1>Medical Booking App</h1>
</div>

<h4 align="center">A doctor appointment web application made with <a href="https://nextjs.org/" target="_blank">Next.js</a>, <a href="https://graphql.org/" target="_blank">GraphQL</a>, <a href="https://www.prisma.io/" target="_blank">Prisma</a> and <a href="https://tailwindcss.com/" target="_blank">TailwindCSS</a>.</h4>

<p align="center">
  <a href="https://www.paypal.me/ChelnyD">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>

<p align="center">
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a> •
  <a href="#websites">Websites</a>
</p>

![screenshot](public/assets/images/github/desktop-home-page.png)

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chelny/medical-booking-app

# Go into the repository
$ cd medical-booking-app
```

First, you must create the "MedicalBookingApp" database. You will find the .sql file in the root directory of the project (eg.: _`MedicalBookingApp_[YYYY-MM-DD].sql`_). Import this file to your local database. \*\*\_NOTE_**: The MySQL version must be at **8.0.32.\*\*

Then, set up Prisma:

```bash
# Creating your Prisma schema file
$ npx prisma init
```

As stated in the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgres#set-up-prisma):

> This command does two things:
>
> - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
>
> - creates the `.env` file in the root directory of the project, which is used for defining environment variables (such as your database connection)

<br />

Open the `.env` file and add the missing keys and their values:

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public?serverTimezone=UTC"

APP_URL=http://localhost:3000
API_PATH=/api/graphql

# Auth Tokens
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# Email Service
TRANSPORTER_SERVICE=
TRANSPORTER_NAME="Medical Booking App"
TRANSPORTER_AUTH_USER=
TRANSPORTER_AUTH_PASS=
RECIPIENT_EMAIL=
```

A sample of the `.env` file is available at `.env.example`.

<br/>

### Run the project

On the terminal, execute the following scripts:

```bash
# Change directory to the root of the project
$ cd medical-booking-app

# Install dependencies
$ yarn

# Run the app
$ yarn dev
```

Open the browser and go to http://localhost:3000/. You should see the login page.

GraphQL playground is accessible at http://localhost:3000/api/graphql in case you need it.

<br/>

### Login Crendentials

A user can either use their `username` or `email` to log in into their account.

|     Username      |              Email              |  Password  |  Role   | Active |
| :---------------: | :-----------------------------: | :--------: | :-----: | :----: |
|       admin       |    admin@medical-booking.app    | Admin1234! |  Admin  |  Yes   |
|    r_marchant     |    r.marchant@example.local     | Test1234!  | Doctor  |  Yes   |
|      dr.mlb       |  m.lord-bertrand@example.local  | Test1234!  | Doctor  |  Yes   |
|        --         |     r.norbert@example.local     | Test1234!  | Doctor  |  Yes   |
|      chelny       |      chelny@example.local       | Test1234!  | Patient |  Yes   |
| michelle_mcgill85 | michelle_mcgill85@example.local | Test1234!  | Patient |   No   |

There is a total of 10 users in the database: 3 admins, 5 doctors and 2 patients.

<p align="end">(<a href="#readme-top">back to top</a>)</p>

## Credits

- Background images: [Unsplash: Beautiful Free Images & Pictures](https://unsplash.com/)
- User images: [This Person Does Not Exist](https://thispersondoesnotexist.com/)
- useForm hook: [fgerschau/react-custom-form-validation-example](https://github.com/fgerschau/react-custom-form-validation-example)
- Multi-step form: [codeempirev/multi-part-form-react-nextjs](https://github.com/codeempirev/multi-part-form-react-nextjs)

<p align="end">(<a href="#readme-top">back to top</a>)</p>

## License

MIT

<p align="end">(<a href="#readme-top">back to top</a>)</p>

## Websites

GitHub: [@chelny](https://github.com/chelny) &nbsp;&middot;&nbsp;
LinkedIn: [Chelny](https://linkedin.com/in/chelny)

<p align="end">(<a href="#readme-top">back to top</a>)</p>
