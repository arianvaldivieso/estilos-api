import { createConnection } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleType } from 'src/@core/enums/role-type.enum';

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
