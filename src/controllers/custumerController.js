const controller = {};

controller.list = (req, res) => {

    console.log(req.session);

    if (!req?.session?.user_id) {
        return res.redirect('/login');
    }
    req.getConnection((err, conn) => {

        // const sql = "SELECT * FROM customer where user_id = '"+req.session.user_id+"'";  
        conn.query('SELECT * FROM customer where user_id = ?', req.session.user_id, (err, customer) =>{
            if(err){
                res.json(err);
            }
            res.render('customer',{
                data: customer
            });

        });

    });
};

controller.save = (req,res) => {
    console.log('agendar cita');
    const data = req.body;
    data.user_id = req.session.user_id;

    console.log(data);

req.getConnection((err, conn)=> {
    conn.query('INSERT INTO customer set ?', [data], (err, customer) =>{
        console.log(customer);
        res.redirect('/');
    });
});
};


controller.edit = (req, res) =>{
    const { id } = req.params;
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM customer WHERE id = ?', [id], (err,customer ) =>{
            res.render('customer_edit', {
                data: customer[0]
            })

        });

    });
}

controller.update = (req, res) =>{
    const {id} = req.params;
    const newCustomer = req.body;
    req.getConnection ((err,conn) =>{
        conn.query('UPDATE customer set ? WHERE id = ?', [newCustomer, id], (err, rows) =>{
            res.redirect('/');

        });
    });

};


controller.delete = (req,res) =>{
    const { id } = req.params;
req.getConnection((err,conn) =>{
    conn.query('DELETE FROM customer WHERE id = ? ', [id], (err, rows) =>{
        res.redirect('/');
    })

})

};

module.exports = controller;