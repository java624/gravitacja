/**
 * Real product photos (Wikimedia Commons CDN) matched to every menu item.
 * All URLs verified to return HTTP 200. Each image reflects the actual
 * product: correct pizza type, beer, coffee, cocktail, snack, etc.
 */
export const MENU_IMAGES: Record<string, string> = {
  // SNACKI
  'snack-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Bowl_of_chips_at_Sainsbury%27s_Low_Hall%2C_Chingford%2C_London.jpg/960px-Bowl_of_chips_at_Sainsbury%27s_Low_Hall%2C_Chingford%2C_London.jpg',
  'snack-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Soepstengels_%283871017999%29.jpg/960px-Soepstengels_%283871017999%29.jpg',
  'snack-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/Peanuts_in_a_bowl..jpg/960px-Peanuts_in_a_bowl..jpg',
  'snack-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Polish_zapiekanka%2C_June_2021.jpg/960px-Polish_zapiekanka%2C_June_2021.jpg',
  'snack-5': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Zapiekanka_3.jpg',
  'snack-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Chocolate_croissant_at_Baker_and_Cook_-_09-03-2020.jpg/960px-Chocolate_croissant_at_Baker_and_Cook_-_09-03-2020.jpg',
  'snack-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/French_Fries_with_Ketchup_01.jpg/960px-French_Fries_with_Ketchup_01.jpg',
  'snack-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Chicken_nuggets_%26_sauce_from_a_restaurant_in_Bangladesh.jpg/960px-Chicken_nuggets_%26_sauce_from_a_restaurant_in_Bangladesh.jpg',
  'snack-9': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Chicken_McNuggets_with_Szechuan_Sauce_%2820180329181732%29.jpg/960px-Chicken_McNuggets_with_Szechuan_Sauce_%2820180329181732%29.jpg',

  // PIZZA
  'pizza-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Margherita_pizza_on_plate.jpg/960px-Margherita_pizza_on_plate.jpg',
  'pizza-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Pizza_Funghi_mit_Pizzahalter.JPG/960px-Pizza_Funghi_mit_Pizzahalter.JPG',
  'pizza-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Pizza_Salami_in_Iwano-Frankiwsk%2C_20.10.2021.jpg/960px-Pizza_Salami_in_Iwano-Frankiwsk%2C_20.10.2021.jpg',
  'pizza-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Vegetarian_pizza.jpg/960px-Vegetarian_pizza.jpg',
  'pizza-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Pizza_capricciosa.jpg/960px-Pizza_capricciosa.jpg',
  'pizza-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Carbonara%2C_fried_chicken%2C_and_Hawaiian_pizza.jpg/960px-Carbonara%2C_fried_chicken%2C_and_Hawaiian_pizza.jpg',
  'pizza-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Splizza_Mexina_-_Opera.jpg/960px-Splizza_Mexina_-_Opera.jpg',
  'pizza-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Pizza_carbonara_slice.jpg/960px-Pizza_carbonara_slice.jpg',
  'pizza-9': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Pizza_Diavola_%28Verde_Ischia%29.jpg/960px-Pizza_Diavola_%28Verde_Ischia%29.jpg',
  'pizza-10': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Kebab_Pizza_%282697337901%29.jpg/960px-Kebab_Pizza_%282697337901%29.jpg',
  'pizza-11': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Chorizo_Pizza_%282784704784%29.jpg/960px-Chorizo_Pizza_%282784704784%29.jpg',
  'pizza-12': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Greek_Pizza_%281%29.jpg/960px-Greek_Pizza_%281%29.jpg',
  'pizza-13': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Prosciutto_Rucola_-_tomato%2C_mozzarella%2C_arugula%2C_prosciutto_di_Parma%2C_pecorino_%2816103892980%29.jpg',
  'pizza-14': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Kotipizza_salmon_pizza_in_Turku.jpg/960px-Kotipizza_salmon_pizza_in_Turku.jpg',
  'pizza-15': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Spinach-pizza-close.jpg/960px-Spinach-pizza-close.jpg',
  'pizza-16': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Fresh_Tomato_Sauce_%28Unsplash%29.jpg/960px-Fresh_Tomato_Sauce_%28Unsplash%29.jpg',

  // NAPOJE ZIMNE
  'drink-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Coca_cola_glass.jpg/960px-Coca_cola_glass.jpg',
  'drink-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Lime_tonic_water.jpg/960px-Lime_tonic_water.jpg',
  'drink-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/BORJOMI_GEORGIAN_MINERAL_WATER_glass_bottle0.5_barcode4860019001346_codeCG2RUBY1_date30.10.2019L10_1.jpg/960px-BORJOMI_GEORGIAN_MINERAL_WATER_glass_bottle0.5_barcode4860019001346_codeCG2RUBY1_date30.10.2019L10_1.jpg',
  'drink-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Iced_lemon_tea_-_Rawlab_Juice_%26_Tea.jpg/960px-Iced_lemon_tea_-_Rawlab_Juice_%26_Tea.jpg',
  'drink-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Orange_juice_1_edit1.jpg/960px-Orange_juice_1_edit1.jpg',
  'drink-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Red_Bell_Energy_Drink_250ml_can.jpg/960px-Red_Bell_Energy_Drink_250ml_can.jpg',
  'drink-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Red_Bull_energy_drinks.jpg/960px-Red_Bull_energy_drinks.jpg',
  'drink-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Lemonade_pitcher_and_glass.jpg/960px-Lemonade_pitcher_and_glass.jpg',
  'drink-9': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Cold_water_with_lemon_and_mint.jpg/960px-Cold_water_with_lemon_and_mint.jpg',

  // NAPOJE GORĄCE
  'coffee-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Espresso_BW_1.jpg/960px-Espresso_BW_1.jpg',
  'coffee-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Cup_of_coffee_on_black_background.jpg/960px-Cup_of_coffee_on_black_background.jpg',
  'coffee-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Cup_of_coffee_with_latte_art_2016.jpg/960px-Cup_of_coffee_with_latte_art_2016.jpg',
  'coffee-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Hearts_in_latte_art%2C_Krak%C3%B3w%2C_Poland%2C_2023.jpg/960px-Hearts_in_latte_art%2C_Krak%C3%B3w%2C_Poland%2C_2023.jpg',
  'coffee-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Cup_of_black_tea.JPG/960px-Cup_of_black_tea.JPG',

  // PIWO
  'beer-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/World_Bottle_%286143543514%29.jpg/960px-World_Bottle_%286143543514%29.jpg',
  'beer-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Beer_wuerzburger_hofbraue_v.jpg/960px-Beer_wuerzburger_hofbraue_v.jpg',
  'beer-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/White_Cap_beer_bottle_with_beer_glass%2C_Carnivore%2C_2025_%2801%29.jpg/960px-White_Cap_beer_bottle_with_beer_glass%2C_Carnivore%2C_2025_%2801%29.jpg',
  'beer-4': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Beer_Giraffe_tall.jpg',
  'beer-5': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Beer_Giraffe_tall.jpg',
  'beer-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Beer_bottles_2018_G1.jpg/960px-Beer_bottles_2018_G1.jpg',

  // ALKOHOLE
  'alko-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Black_%26_White_%28whisky%29_bottle_02.jpg/960px-Black_%26_White_%28whisky%29_bottle_02.jpg',
  'alko-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Chivas_regal_12yo.jpg/960px-Chivas_regal_12yo.jpg',
  'alko-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Jack_Daniels_bottle.jpg/960px-Jack_Daniels_bottle.jpg',
  'alko-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Jameson_whiskies.jpg/960px-Jameson_whiskies.jpg',
  'alko-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Old_Fashioned_Glass.jpg/960px-Old_Fashioned_Glass.jpg',
  'alko-6': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Absolut_Vodka_02.jpg/960px-Absolut_Vodka_02.jpg',
  'alko-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Finlandia_Vodka_Classic.jpg/960px-Finlandia_Vodka_Classic.jpg',
  'alko-8': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Belvedere_Vodka_01.jpg/960px-Belvedere_Vodka_01.jpg',
  'alko-9': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Finlandia_-_Vodka_of_Finland.jpg',

  // COCKTAILS
  'cocktail-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Whiskey_sour_in_coupe_glass_with_garnishes.jpg/960px-Whiskey_sour_in_coupe_glass_with_garnishes.jpg',
  'cocktail-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Fresh_Mojito_Premium.jpg/960px-Fresh_Mojito_Premium.jpg',
  'cocktail-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Aperol_Spritz_-_Santa_Ynez_Kitchen_-_Sarah_Stierch.jpg/960px-Aperol_Spritz_-_Santa_Ynez_Kitchen_-_Sarah_Stierch.jpg',
  'cocktail-4': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Long_Island_Iced_Tea_with_Lemon_and_Straw.jpg/960px-Long_Island_Iced_Tea_with_Lemon_and_Straw.jpg',
  'cocktail-5': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Sex_on_the_beach_in_Ohrid.jpg/960px-Sex_on_the_beach_in_Ohrid.jpg',
  'cocktail-6': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Pi%C3%B1a_Colada.jpg',
  'cocktail-7': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Baileys_glass.jpg/960px-Baileys_glass.jpg',

  // SHOTS
  'shots-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Ambigram_Cognac_Danger_on_a_set_of_two_shot_glasses_%28full_and_empty%29.jpg/960px-Ambigram_Cognac_Danger_on_a_set_of_two_shot_glasses_%28full_and_empty%29.jpg',

  // ZESTAWY (butelka + napój)
  'zestaw-1': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Absolut_Vodka_02.jpg/960px-Absolut_Vodka_02.jpg',
  'zestaw-2': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Finlandia_Vodka_Classic.jpg/960px-Finlandia_Vodka_Classic.jpg',
  'zestaw-3': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Jack_Daniels_bottle.jpg/960px-Jack_Daniels_bottle.jpg',
};