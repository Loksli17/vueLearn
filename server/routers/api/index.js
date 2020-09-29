const 
    express    = require('express'),
    controller = require('../../controllers/indexController'),
    router     = express.Router();

router.get('/'      , controller.actionIndex);
router.get('/create', controller.actionCreate);
router.get('/delete', controller.actionDelete);

module.exports = router;