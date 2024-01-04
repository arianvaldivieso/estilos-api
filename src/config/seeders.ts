import { RoleType } from '@core/enums/role-type.enum';
import { Role } from 'modules/roles/entities/role.entity';
import { createConnection } from 'typeorm';

async function run() {
  const connection = await createConnection();

  const roleRepository = connection.getRepository(Role);

  for (const roleType of Object.values(RoleType)) {
    const role = new Role();
    role.name = roleType;

    await roleRepository.save(role);
  }

  await connection.close();
}

run().catch(console.error);
