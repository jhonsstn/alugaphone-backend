import Controller from '../../controllers/interfaces/controller';

const adaptSignUp = (controller: Controller) => async (req: any, res: any) => {
  const httpRequest = {
    body: {
      ...req.body,
      ...req.params,
      authorization: req.headers.authorization,
    },
  };
  const httpResponse = await controller.handle(httpRequest);
  const { statusCode, body } = httpResponse;
  res.status(statusCode).json(body);
};

export default adaptSignUp;
