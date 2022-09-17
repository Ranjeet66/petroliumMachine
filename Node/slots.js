// let stime = '09:00'
// var startTime = stime.substring(0,5) + ':00';
// var currentdate = new Date();
// var datetime = "Last Sync: "+currentdate.getHours()+":"+ currentdate.getMinutes()+":"+currentdate.getSeconds();
// console.log(datetime,startTime);
// if(datetime>=startTime){
    
// }
// let d1 = new Date()
// d1.setMinutes(d1.getTime() + 15*60000)
//  console.log(d1); 
// let t=[]
// let d2 = new Date()
// for(j=09;j<17;j++){
//  if(j!=13){
// let ra=[];
// d2.setMinutes(00)+d2.setHours(j)+d2.setSeconds(00)
// for(let i=0;i<4;i++){
//     let f =15*i
//     d2.setMinutes(f)
//     let r= d2.toLocaleTimeString()
//     let e =15*(i+1)
//     d2.setMinutes(e)
//     let s= d2.toLocaleTimeString()
//     let x=`${r} to ${s}`
//     ra.push(x);
// }
// console.log(ra);
// t.push(ra) 
// }
// else{
// d2.setMinutes(00)+d2.setHours(j)+d2.setSeconds(00)
// let r= d2.toLocaleTimeString()
// d2.setMinutes(00)+d2.setHours(14)+d2.setSeconds(00)
// let m= d2.toLocaleTimeString()
// console.log(`       break/lunch time: ${r} to ${m}`); 
// }
// }
// console.log(t);

// let y= x.toLocaleTimeString()+" AM"
// d2.setMinutes(15)

// let r= d2.toLocaleTimeString()+" AM"


// console.log(x);
// d2.setMinutes(70)
// // let q=d2.setMinutes()+15*60000
// let y= d2.toLocaleTimeString()+" AM"
// console.log(y);

// d1.setMinutes ( d1.getMinutes() + 30 );
// let d2 = new Date()
// const w = new Date().toISOString()
// console.log(w);
let r ='10:59:00 pm'
const d1 = new Date().toLocaleTimeString()
if (r>=d1) {
    console.log(true);
}else{
    console.log(false);
}  
