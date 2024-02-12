import { addUser, deleteUser, getUsers, putUser} from "./api";

describe('scenario 3: incorrect registration flow', () => {
  test('should add, put and delete user', async () => {
    const initialUsersResponse = await getUsers('abc123');   
    expect(initialUsersResponse.statusCode).toBe(400);

    const addedUserResponse = await addUser('ABC');
    const addedUser = JSON.parse(addedUserResponse._data);
    expect(addedUser.username).toBe('ABC');

    const userID = addedUser.id;

    const getUserResponse = await getUsers(userID);   
    expect(getUserResponse.statusCode).toBe(200);

    const getUserData = JSON.parse(getUserResponse._data);
    expect(getUserData.username).toBe('ABC');

    const putUserResponse = await putUser('wrongID', 'QWE');
    expect(putUserResponse.statusCode).toBe(400);

    const getUserResponseNew = await getUsers(userID);   
    expect(getUserResponseNew.statusCode).toBe(200);

    const getUserDataNew = JSON.parse(getUserResponseNew._data);
    expect(getUserDataNew.username).toBe('ABC');

    const deleteUserWrongResponse = await deleteUser('wrongID');
    expect(deleteUserWrongResponse.statusCode).toBe(400);

    const getUserResponseAfterWrongDelete = await getUsers(userID);   
    expect(getUserResponseAfterWrongDelete.statusCode).toBe(200);  

    const deleteUserResponse = await deleteUser(userID);
    expect(deleteUserResponse.statusCode).toBe(204);

    const getUserResponseAfterDelete = await getUsers(userID);   
    expect(getUserResponseAfterDelete.statusCode).toBe(404);       
  })  
})