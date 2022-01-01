function User(firstName, lastName, age, gender){
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
	this.gender = gender;
}

const user1 = User("John", "Smith", 26, "male");
const user200 = User("Jill", "Robinson", 25, "femail");

User.prototype.emailDomain = "@facebook.com";
User.prototype.getEmailAddress = ()=>{
	return this.firstName + this.lastName + this.emailDomain;
}

console.log(user1);
console.log(user2);

user1.getEmailAddress();
