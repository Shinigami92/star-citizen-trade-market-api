import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
	pgm.sql(
		`INSERT INTO public.game_version(identifier) VALUES (\'${[
			'3.0.0-live.695052',
			'3.0.1-live.706028',
			'3.0.1-ptu.706028',
			'3.1.0-live.738964',
			'3.1.1-live.740789',
			'3.1.1-ptu.741817',
			'3.1.2-live.744137',
			'3.1.2-ptu.742582',
			'3.1.2-ptu.743249',
			'3.1.2-ptu.743849',
			'3.1.2-ptu.744137',
			'3.1.3-live.746975',
			'3.1.3-ptu.745418',
			'3.1.3-ptu.745900',
			'3.1.3-ptu.746531',
			'3.1.3-ptu.746975',
			'3.1.3-ptu.746976',
			'3.1.4-live.75748',
			'3.1.4-live.757485',
			'3.1.4-ptu.748380',
			'3.1.4-ptu.749296',
			'3.1.4-ptu.749761',
			'3.1.4-ptu.750135',
			'3.1.4-ptu.751263',
			'3.1.4-ptu.751710',
			'3.1.4-ptu.753197',
			'3.1.4-ptu.753198',
			'3.1.4-ptu.755845',
			'3.1.4-ptu.757485',
			'3.2.0-live.796019',
			'3.2.0-ptu.790942',
			'3.2.0-ptu.791185',
			'3.2.0-ptu.792285',
			'3.2.0-ptu.793226',
			'3.2.0-ptu.794284',
			'3.2.0-ptu.796019',
			'3.2.0.ptu-785795',
			'3.2.0.ptu-787025',
			'3.2.0.ptu-795153',
			'3.2.1-live.834470',
			'3.2.1-ptu.808574',
			'3.2.1-ptu.819037',
			'3.2.1-ptu.820844',
			'3.2.1-ptu.823435',
			'3.2.1-ptu.827813',
			'3.2.1-ptu.829574',
			'3.2.1-ptu.830734',
			'3.2.1-ptu.832719',
			'3.2.1-ptu.834470',
			'3.2.1-ptu.838080',
			'3.2.2-live.846694',
			'3.3.0-live.986748',
			'3.3.0-ptu.384391',
			'3.3.0-ptu.958272',
			'3.3.0-ptu.958784',
			'3.3.0-ptu.966418',
			'3.3.0-ptu.968336',
			'3.3.0-ptu.969246',
			'3.3.0-ptu.969870',
			'3.3.0-ptu.971097',
			'3.3.0-ptu.972126',
			'3.3.0-ptu.973591',
			'3.3.0-ptu.974900',
			'3.3.0-ptu.975676',
			'3.3.0-ptu.977866',
			'3.3.0-ptu.978652',
			'3.3.0-ptu.979539',
			'3.3.0-ptu.980830',
			'3.3.0-ptu.981976',
			'3.3.0-ptu.984109',
			'3.3.0-ptu.985467',
			'3.3.0-ptu.985953',
			'3.3.0-ptu.986748',
			'3.3.5-live.996871',
			'3.3.5-ptu.987405',
			'3.3.5-ptu.990428',
			'3.3.5-ptu.991429',
			'3.3.5-ptu.993091',
			'3.3.5-ptu.993498',
			'3.3.5-ptu.994255',
			'3.3.5-ptu.996871',
			'3.3.6-live.998172',
			'3.3.6-ptu.998172'
		].join("'), ('")}\')`
	);
	pgm.sql(
		`INSERT INTO public.commodity_category(name) VALUES (\'${[
			'Agricultural Supply',
			'Food',
			'Gas',
			'Medical Supply',
			'Metal',
			'Mineral',
			'Scrap',
			'Vice',
			'Waste'
		].join("'), ('")}\')`
	);

	const commodityItems: Array<{ name: string; category: string; gameVersion: string }> = [
		{ name: 'Agricium', category: 'Metal', gameVersion: '3.0.0-live.695052' },
		{ name: 'Agricultural Supply', category: 'Agricultural Supply', gameVersion: '3.0.0-live.695052' },
		{ name: 'Aluminum', category: 'Metal', gameVersion: '3.0.0-live.695052' },
		{ name: 'Astatine', category: 'Gas', gameVersion: '3.0.0-live.695052' },
		{ name: 'Beryl', category: 'Mineral', gameVersion: '3.0.0-live.695052' },
		{ name: 'Chlorine', category: 'Gas', gameVersion: '3.0.0-live.695052' },
		{ name: 'Corundum', category: 'Mineral', gameVersion: '3.0.0-live.695052' },
		{ name: 'Diamond', category: 'Mineral', gameVersion: '3.0.0-live.695052' },
		{ name: 'Distilled Spirits', category: 'Vice', gameVersion: '3.0.0-live.695052' },
		{ name: 'Fluorine', category: 'Gas', gameVersion: '3.0.0-live.695052' },
		{ name: 'Gold', category: 'Metal', gameVersion: '3.0.0-live.695052' },
		{ name: 'Hydrogen', category: 'Gas', gameVersion: '3.0.0-live.695052' },
		{ name: 'Iodine', category: 'Gas', gameVersion: '3.0.0-live.695052' },
		{ name: 'Laranite', category: 'Mineral', gameVersion: '3.0.0-live.695052' },
		{ name: 'Medical Supplies', category: 'Medical Supply', gameVersion: '3.0.0-live.695052' },
		{ name: 'Processed Food', category: 'Food', gameVersion: '3.0.0-live.695052' },
		{ name: 'Quartz', category: 'Mineral', gameVersion: '3.0.0-live.695052' },
		{ name: 'Scrap', category: 'Scrap', gameVersion: '3.0.0-live.695052' },
		{ name: 'Stims', category: 'Vice', gameVersion: '3.0.0-live.695052' },
		{ name: 'Titanium', category: 'Metal', gameVersion: '3.0.0-live.695052' },
		{ name: 'Tungsten', category: 'Metal', gameVersion: '3.0.0-live.695052' },
		{ name: 'Waste', category: 'Waste', gameVersion: '3.0.0-live.695052' }
	];

	for (const commodityItem of commodityItems) {
		pgm.sql(
			'INSERT INTO public.item(type, name, commodity_category_id, in_game_since_version_id)' +
				` SELECT 'COMMODITY', '${commodityItem.name}', cc.id, g.id` +
				' FROM game_version g' +
				` JOIN commodity_category cc ON cc.name = '${commodityItem.category}'` +
				` WHERE g.identifier = '${commodityItem.gameVersion}'`
		);
	}
}

export function down(pgm: MigrationBuilder): void {
	pgm.sql('DELETE FROM public.item');
	pgm.sql('DELETE FROM public.commodity_category');
	pgm.sql('DELETE FROM public.game_version');
}
