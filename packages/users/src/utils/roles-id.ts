import PermissionLevel from '../types/permisionLevel.type';

const convertPermissionToRoleId = (permission: PermissionLevel) => {
  switch (permission) {
    case PermissionLevel.Admin:
      return 'rol_DMn1V3ucUqUcuLhY';
    case PermissionLevel.SuperAdmin:
      return 'rol_YxM1I50uhNXavdkg';
    default:
      return 'rol_Hsd0deM24ypRj2NS';
  }
};

export default convertPermissionToRoleId;