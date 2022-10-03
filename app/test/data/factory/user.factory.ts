import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../../src/user/entities/user.entity';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();
  user.firstName = faker.name.firstName('male');
  user.lastName = faker.name.lastName('male');
  user.email = faker.internet.email(user.firstName, user.lastName);
  user.password = faker.random.alphaNumeric(5);

  return user;
});
