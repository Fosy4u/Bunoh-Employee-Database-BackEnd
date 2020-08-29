const express = require('express');
const cors = require('cors');
const knex = require('knex');
const multer = require('multer');
const fs = require('fs')



const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'Nwengozi4u',
        database: 'bunoh',
        dateStrings: true
        
    },
    pool: {min: 0, max: 50}
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },

    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }

});

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }
});



getAllStaff = (db) => {
    return db.select("*").from("employees").then(rows => rows);
}


app.get('/', (req, res) => {

    getAllStaff(db).then(data => { res.send(data) });
    


});




app.post('/Register', upload.single('Image'), (req, res) => {
    
    const { FirstName, LastName, Email, Address, PostCode, PassportNumber, PassportExpiryDate, TrainingDate, TrainingExpiryDate, NINO,
        DBSNumber, DBSExpiryDate, DateofBirth, PhoneNumber, Uniform, StaffCard, StaffCardIssueDate } = req.body;
    if (req.file) {
        db('employees').insert({

            firstname: FirstName,
            lastname: LastName,
            dateofbirth: DateofBirth,
            email: Email,
            image: "http://localhost:3001/" + req.file.path,
            address: Address,
            postCode: PostCode,
            passportnumber: PassportNumber,
            passportexpiryDate: PassportExpiryDate,
            trainingdate: TrainingDate,
            trainingexpirydate: TrainingExpiryDate,
            nino: NINO,
            dbsnumber: DBSNumber,
            dbsexpirydate: DBSExpiryDate,
            phonenumber: PhoneNumber,
            uniform: Uniform,
            staffcard: StaffCard,
            staffcardissueddate: StaffCardIssueDate,
        })

            .then(response => { res.json('Success! You have created a new staff') })
            .catch(err => res.status(400).json(err))

    }
    else {
        db('employees').insert({

            firstname: FirstName,
            lastname: LastName,
            dateofbirth: DateofBirth,
            email: Email,
            image:"NULL",
            address: Address,
            postCode: PostCode,
            passportnumber: PassportNumber,
            passportexpirydate: PassportExpiryDate,
            trainingdate: TrainingDate,
            trainingexpirydate: TrainingExpiryDate,
            nino: NINO,
            dbsnumber: DBSNumber,
            dbsexpirydate: DBSExpiryDate,
            phonenumber: PhoneNumber,
            uniform: Uniform,
            staffcard: StaffCard,
            staffcardissueddate: StaffCardIssueDate,

        })
            .then(response => { res.json('Success! You have created a new staff') })
            .catch(err => res.status(400).json(err))

    }


       
})


     
  
app.put('/update:id', upload.single('Image'), (req, res) => {

    const {  FirstName, LastName, Email, Address, PostCode, PassportNumber, PassportExpiryDate, TrainingDate, TrainingExpiryDate, NINO,
        DBSNumber, DBSExpiryDate, DateofBirth, PhoneNumber, Uniform, StaffCard, StaffCardIssueDate } = req.body;
    if (req.file) {
        return db('employees').where(
            'id', req.params.id,

        ).update({

            firstname: FirstName,
            lastname: LastName,
            dateofbirth: DateofBirth,
            email: Email,
            image: "http://localhost:3001/" + req.file.path,
            address: Address,
            postCode: PostCode,
            passportnumber: PassportNumber,
            passportexpirydate: PassportExpiryDate,
            trainingdate: TrainingDate,
            trainingexpirydate: TrainingExpiryDate,
            nino: NINO,
            dbsnumber: DBSNumber,
            dbsexpirydate: DBSExpiryDate,
            phonenumber: PhoneNumber,
            uniform: Uniform,
            staffcard: StaffCard,
            staffcardissueddate: StaffCardIssueDate,
        })

            .then(response => { res.json(response) })
            .catch(err => res.status(400).json(err))


    }
    else {
        return db('employees').where(
            'id', req.params.id,

        ).update({
            firstname: FirstName,
            lastname: LastName,
            dateofbirth: DateofBirth,
            email: Email,
            
            address: Address,
            postCode: PostCode,
            passportnumber: PassportNumber,
            passportexpirydate: PassportExpiryDate,
            trainingdate: TrainingDate,
            trainingexpirydate: TrainingExpiryDate,
            nino: NINO,
            dbsnumber: DBSNumber,
            dbsexpirydate: DBSExpiryDate,
            phonenumber: PhoneNumber,
            uniform: Uniform,
            staffcard: StaffCard,
            staffcardissueddate: StaffCardIssueDate,

        })
            .then(response => { res.json(response) })
            .catch(err => res.status(400).json(err))
            
    }



})





app.delete('/del:id', (req, res) => {
    db('employees').where(
        'id', req.params.id,

    ).del()
    
        .then(response => { res.json(response) })
        .catch(err => res.status(400).json(err))
   
})


app.get('/user/:id', (req, res) => {
    
    db('employees').where({
        id: req.params.id,

    }).first().select('*')

        .then(response => { res.json(response) })
        .catch(err => res.status(400).json(err))
    
})

let date = new Date();
let today = ("0" + date.getDate()).slice(-2);
let month = ("0" + (date.getMonth() + 2)).slice(-2) ;
let year = date.getFullYear();
let wholeday = (year + "-" + month + "-" + today);

app.get('/checkpassport', (req, res) => {
    console.log('fetched');
    db('employees').where(
        "passportexpirydate", "<", wholeday

    ).select('firstname', 'id', 'lastname','passportexpirydate', 'phonenumber', 'email')

        .then(response => { res.json(response) })
        .catch(err => res.status(400).json(err))

})
app.get('/checktraining', (req, res) => {
    console.log('fetched');
    db('employees').where(
        "trainingexpirydate", "<", wholeday

    ).select('firstname', 'id', 'lastname', 'trainingexpirydate', 'phonenumber', 'email')

        .then(response => { res.json(response) })
        .catch(err => res.status(400).json(err))

})

app.get('/checkdbs', (req, res) => {
    console.log('fetched');
    db('employees').where(
        "dbsexpirydate", "<", wholeday

    ).select('firstname', 'id', 'lastname', 'dbsexpirydate', 'phonenumber', 'email')

        .then(response => { res.json(response) })
        .catch(err => res.status(400).json(err))

})




/* --> res this is working
 /Register --> Post = User
 /Edit ---> PUT = Success or Fail
 /Delete --- DEL = Remove User

*/












app.listen(3001);