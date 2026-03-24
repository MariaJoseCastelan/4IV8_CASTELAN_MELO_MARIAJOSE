
import java.util.Scanner;

public static void main (String[] args){
Scanner sc = new Scanner(System.in);
System.out.println("Menu del programa");
    System.out.println("Eliga una opcion del 1 al 3");

    int opcion = sc.nextInt();


 do { 

     switch (opcion) {
         case 1:
            System.out.println("Escriba su nombre: ");
            String nombre = sc.nextLine();

            System.out.println("Escriba su apellido paterno: ");
            String apellidop =  sc.nextLine();

            System.out.println("Escriba su apellido materno: ");
            String apellidom = sc.nextLine();

            System.out.println("Escriba su fecha de nacimiento (todo con letras): ");
            String fechanacimiento = sc.nextLine();
            break;

            case 2:
            System.out.println();
         default:
             throw new AssertionError();
     }
 } while ( opcion < 3);
    


}