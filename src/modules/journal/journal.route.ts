import express from 'express';
import * as journalController from './journal.controller';
import { validate } from '@middlewares';
import { createJournalSchema, updateJournalSchema } from './dtos';

const router = express.Router();

router.get('/', journalController.getAll);
router.get('/:id', journalController.getById);
router.post('/create', validate(createJournalSchema), journalController.create);
router.put(
  '/update/:id',
  validate(updateJournalSchema),
  journalController.update
);
router.delete('/hard-delete/:id', journalController.hardDelete);

export default router;
