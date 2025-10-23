const sessionIdToUserMap = new Map()
// used to create directory of js 
function setUser(id,user){
    sessionIdToUserMap.set(id,user)
}
function getUser(id){
    return sessionIdToUserMap.get(id)
}
module.exports={
    setUser,
    getUser,
}
