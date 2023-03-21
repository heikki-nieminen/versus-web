const router = require('express').Router()

router.get('/', (req, res) => {
    res.send("TESTI")
})

router.get('/testi', (req,res) => {
    res.send("Testisivu")
})


module.exports = router