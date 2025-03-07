const dbConnection=require("./mongodb");
const insert= async ()=>{
  const db= await dbConnection();
  const result = await db.deleteOne({name:"smasgg"})




  console.log(result)
}
insert();