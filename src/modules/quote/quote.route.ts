import { Router } from 'express';
import * as quoteController from './quote.controller';
import { validate } from '@middlewares';
import { createQuoteSchema } from '@modules/quote/dtos';

const router = Router();

router.get('/', quoteController.getAll);
router.get('/:id', quoteController.getById);
router.post('/create', validate(createQuoteSchema), quoteController.create);
router.put('/update/:id', quoteController.update);

export default router;
