# Incidents Reporting

Demo web page for Incidents Reporting

### Front-end

- pages are created by using EJS Template in the **views** folder
- CSS and JavaScript files are in the **public** folder

### Back-end

- Node.js is used for Server side is defined in **app.js** file
- Routes are defined in **/routes/** folder
- User Authentication is done by using 'Passport' package passport-local in **/routes/passport.js** file

#### Sqlite Database

- all the sql functions are defined in **/models/sql.js** file
- There are four tables in the Database

##### View [Database Class Diagram](https://cdn.glitch.com/9bee8661-4022-432d-b709-a22e0c27bd43%2FDiagram_0.pdf?v=1613978704317)

| No  | Table Name | Description                      |
| --- | ---------- | -------------------------------- |
| 1   | Incidents  | All the Incidents are saved here |
| 2   | IncOrgs    | Organisation Details             |
| 3   | IncUsers   | User Details                     |
| 4   | IncTests   | Test Results Details             |