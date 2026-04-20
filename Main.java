import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int opcion;

        do {
            System.out.println("\nMenu del programa");
            System.out.println("Elija una opcion del 1 al 3");
            System.out.println("1. Datos personales");
            System.out.println("2. Calculo de volumen");
            System.out.println("3. Salir");

            opcion = sc.nextInt();
            sc.nextLine(); // ✅ limpia el buffer después de nextInt()

            switch (opcion) {
                case 1:
                    System.out.println("Escriba su nombre: ");
                    String nombre = sc.nextLine();

                    System.out.println("Escriba su apellido paterno: ");
                    String apellidop = sc.nextLine();

                    System.out.println("Escriba su apellido materno: ");
                    String apellidom = sc.nextLine();

                    System.out.println("Escriba su fecha de nacimiento (todo con letras): ");
                    String fechanacimiento = sc.nextLine();

                    System.out.println("\nNombre completo: " + nombre + " " + apellidop + " " + apellidom);
                    System.out.println("Fecha de nacimiento: " + fechanacimiento);
                    break;

                case 2:
                    System.out.println("Elija una figura geometrica:");
                    System.out.println("1. Prisma");
                    System.out.println("2. Piramide");
                    int figura = sc.nextInt();
                    sc.nextLine(); // ✅ limpia el buffer

                    switch (figura) {
                        case 1:
                            System.out.println("Escriba el area de la base: ");
                            double areabase = sc.nextDouble();

                            System.out.println("Escriba la altura del prisma: ");
                            double alturaprism = sc.nextDouble();

                            double volumenprisma = areabase * alturaprism;
                            System.out.println("El volumen del prisma es: " + volumenprisma);
                            break;

                        case 2:
                            System.out.println("Escriba el area de la base: ");
                            double areabasep = sc.nextDouble();

                            System.out.println("Escriba la altura de la piramide: ");
                            double alturapiramide = sc.nextDouble();

                            double volumenpiramide = (areabasep * alturapiramide) / 3;
                            System.out.println("El volumen de la piramide es: " + volumenpiramide);
                            break;

                        default:
                            System.out.println("Figura no válida");
                    }
                    break;

                case 3:
                    System.out.println("Saliendo del programa..."); // ✅ case 3 agregado
                    break;

                default:
                    System.out.println("Opcion no válida, intente de nuevo");
            }

        } while (opcion != 3); // ✅ condición correcta
    }
}