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
        console.log(err);
        res.redirect('/');
    });
});
};


controller.edit = (req, res) =>{
    const { id } = req.params;
    req.getConnection((err,conn) =>{
        conn.query('SELECT * FROM customer WHERE id = ?', [id], (err,customer ) =>{
            const now = new Date(customer[0].fecha_cita);
 
            const day = ("0" + now.getDate()).slice(-2);
            const month = ("0" + (now.getMonth() + 1)).slice(-2);
        
            const today = now.getFullYear()+"-"+(month)+"-"+(day) ;
            customer[0].fecha_cita_update = today;
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
            console.log(err);
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