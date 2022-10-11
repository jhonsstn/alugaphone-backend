import Controller from '../../controllers/interfaces/controller';

const adaptSignUp = (controller: Controller) => async (req: any, res: any) => {
  const httpRequest = {
    body: req.body,
  };
  const httpResponse = await controller.handle(httpRequest);
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export default adaptSignUp;
