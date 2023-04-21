/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express';
import { CreateLogInput } from '../schemas/analytics.schema';
import analyticsServices from '../services/analytics.service';

class AnalyticsController {
  async getLogs(req: Request, res: Response) {
    try {
      const logs = await analyticsServices.getLogs();
      return res.status(200).send({
        logs,
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async addLog(req: Request<{}, {}, CreateLogInput>, res: Response) {
    const createLogInput = req.body;
    try {
      await analyticsServices.addLog(createLogInput);
      res.send({ message: 'Log added successfully!' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export default new AnalyticsController();
