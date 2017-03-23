export class Hello {
  public foo: string;
  private privField: string;
  public pubField: number;

  constructor(privField: string, pubField: number) {
    this.privField = privField;
    this.pubField = pubField;
  }

  public sayHello(){
    console.log(`Hello ${this.privField} 
        and ${this.pubField} !`);
  }

  public hello(){
    return "123";
  }

  public static hello() {
    new Hello("aaaa", 123).sayHello();
  }
}
Hello.hello();

var hello: MyInterface = new Hello("123", 123);
var hello2: MyInterface = {
  foo: "123",
  hello: function(){ return "123"; }
}

interface MyInterface {
  foo: string;
  hello(): string;
}

console.log("HELLO FROM SANDBOX");
