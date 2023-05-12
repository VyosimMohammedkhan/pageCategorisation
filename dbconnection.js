const mysql = require('mysql');

function dBConnection(){
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Vyosim@2023',
        database: 'test'
      });

      return connection;
}

function connectToDb(connection){
    connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          return;
        }
        console.log('Connected to MySQL server');
      });
}
  


function sqlQuery(connection){
   let dataArray= connection.query('SELECT * FROM websites', (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          return;
        }
      
        const dataArray = rows.map(row => {
          // Manipulate the row object as needed
          return {
            site_id: row.site_id,
            site_url: row.site_url
          };
        });
      
        return dataArray
      });
      return dataArray
}
 
  
  
function endConnection(connection){

    connection.end((err) => {
        if (err) {
          console.error('Error closing connection:', err);
          return;
        }
        console.log('Connection closed');
      });

}
  async function executeSql(){
    const connection= await dBConnection();
    await connectToDb(connection);
    const dataArray=await sqlQuery(connection);
    console.log(dataArray);
    await endConnection(connection);
  }
  executeSql();