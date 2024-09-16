interface Person {
  name: string;
  age: number;
  isActive: boolean;
  friends: Friend[];
  address: Address2;
}

interface Address2 {
  city: string;
  postalCode: null;
}

interface Friend {
  name: string;
  age: number;
  contact: Contact;
}

interface Contact {
  email: string;
  phone: null;
  address: Address;
}

interface Address {
  street: string;
  city: string;
  postalCode: number;
}