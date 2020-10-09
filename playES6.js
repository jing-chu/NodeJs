const hobbies = ['sing', 'dance']
const copiedArray = [...hobbies]  ///spread operator
console.log(copiedArray)

const toArray = (...args) => {    //rest operator
    return args
}
console.log(toArray(1,2,3,4))

const person = {
    name: 'Max',
    age: 30,
    greet() {
        console.log('Hi I am: ' + this.name)
    }
}

const printName = ({ name }) => {   //onject destructuring
    console.log(name)
}

printName(person)

const { name, age } = person    // object destructuring
console.log(name, age)
console.log(person)

const [hobby1, hobby2] = hobbies   // array destructuring with given bames
console.log(hobby1, hobby2)

//Async code

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Done!');
      }, 1500);
    });
    return promise;
  };
  
  setTimeout(() => {
    console.log('Timer is done!');
    fetchData()
      .then(text => {
        console.log(text);
        return fetchData();
      })
      .then(text2 => {
        console.log(text2);
      });
  }, 2000);
  
  console.log('Hello!');
  console.log('Hi!');
  