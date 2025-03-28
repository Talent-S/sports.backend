import prismaClient from '../config/db.config';

export const seedRolesAndPermissions = async () => {
  const permissions = [
    {
      name: 'MANAGE_PLANS',
      description:
        'Allows managing plans, including creating, updating, and deleting plans.',
    },
  ];
  for (const permission of permissions) {
    await prismaClient.permission.create({
      data: permission,
    });
  }

  // ----- Create Roles -----
  const roles = [
    {
      name: 'Admin',
      descriptions:
        'Has full access to manage users, bookings, payments, and platform settings.',
    },
    {
      name: 'Artist',
      descriptions: 'Can book services, manage bookings, and create reviews.',
    },
    {
      name: 'Expert',
      descriptions:
        'Provides services, manages bookings, and generates reports.',
    },
    {
      name: 'Normal User',
      descriptions:
        'Can follow artists, search for services, and view content.',
    },
  ];

  // ----- Insert Roles into DB -----
  for (const role of roles) {
    await prismaClient.role.create({
      data: role,
    });
  }

  // ----- Assign Permissions to Roles -----
  const rolePermissions = [
    {
      role: 'admin',
      permissions: ['MANAGE_PLANS'],
    },
    {
      role: 'Artist',
      permissions: [],
    },
    {
      role: 'Expert',
      permissions: [],
    },
    {
      role: 'Normal User',
      permissions: [],
    },
  ];

  // Insert Role-Permission relations
  for (const { role, permissions: permissionNames } of rolePermissions) {
    const roleRecord = await prismaClient.role.findUnique({
      where: { name: role },
    });
    for (const permissionName of permissionNames) {
      const permissionRecord = await prismaClient.permission.findUnique({
        where: { name: permissionName },
      });
      await prismaClient.rolePermission.create({
        data: {
          roleId: roleRecord!.id,
          permissionId: permissionRecord!.id,
        },
      });
    }
  }
};
