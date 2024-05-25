const fs = require('fs')
const {Client}  = require('pg')
const csv = require('fast-csv')
const data = []

// // UAT PostgreSQL database connection details
const client = new Client({
  user: 'redmine1',
  host: '143.244.128.161',
  database: 'keen',
  password: 'redhat',
  port: 5432,
   });

   // // postgressql database connection details
  
  // user: 'postgres',
  // host: '172.22.0.7',
  // database: 'redmine',
  // password: 'mysecretpassword',
  // port: 5432,
  //  });

const csvFilePath='/home/amit/punch_details/DailyAttendanceLogsDetails_68.csv'
client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');}
    )
    .catch((error) => {
        console.error('Error connecting to PostgreSQL database:', error);
      });
    


fs.createReadStream(csvFilePath)
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', row => {
         Object.keys(row).forEach((key) => {
         row[key] = row[key].trim();
         }),
          data.push(row)
          // console.log(data)
        })
  .on('end', async() =>{
  
  for(let i=0 ;i<data.length;i++)
{
  const query = {
    text: 'INSERT INTO April2024( date, employee_code, employee_name, company, degination, in_time,  out_time ) VALUES($1, $2, $3, $4, $5, $6,$7)',
    values: [data[i]["Date"], data[i][' Employee Code '], data[i]["Employee Name"], data[i]["Company "], data[i]["Degination"], data[i][" In Time "], data[i]["Out Time "]]
  }
  await client.query(query)
  .then(() => {
    console.log('Inserted row:',i);
  })
  .catch((error) => {
    console.error('Error inserting row:', error);
  })
}
client.end();    

      }
         );


