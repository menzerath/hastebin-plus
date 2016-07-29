public class Dancer {
	private static final String VERSION = "1.2.4.3 Beta 2";

	private String name;
	private int age;
	private int moves;

	public static void main(String[] args) {
		System.out.println("Welcome to DANCE-MASTER 3000 v" + VERSION + "!");
		System.out.println("Creating and testing your Dancers. Please be patient...!");

		Dancer hugo = new Dancer("Hugo", 34, 6);
		Dancer mike = new Dancer("Mike", 81, 2);
		Dancer nori = new Dancer("Nori", 22, 27);
		Dancer john = new Dancer("John", 4, 1);
		Dancer rony = new Dancer("Rony", 42, 24); // WTF is this name?

		System.out.println("Goodbye!");
		System.exit(0);
	}

	public Dancer(String name, int age, int moves) {
		// Save the values
		this.name = name;
		this.age = age;
		this.moves = moves;

		// Welcome our new Dancer
		System.out.println("Welcome, " + name + "!");
		boolean goodDancer = dance(); // Let's go!
	}

	/**
	 * Here the Dancer has to dance.
	 * This is not possible for everyone...
	 *
	 * @return whether the Dancer is a good Dancer or not
	 */
	private boolean dance() {
		if (age > 6 && age < 70 && moves > 5) {
			System.out.println("YEAH! THIS ROCKS!!!");
			return true;
		} else {
			System.out.println("Dude... Move on!");
			return false;
		}
	}
}
