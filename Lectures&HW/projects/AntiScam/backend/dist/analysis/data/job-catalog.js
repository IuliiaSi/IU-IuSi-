"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobCatalog = void 0;
exports.jobCatalog = [
    {
        id: 'maintenance',
        name: 'ТО и расходники',
        jobs: [
            { name: 'Замена масла двигателя', category: 'maintenance' },
            { name: 'Замена масляного фильтра', category: 'maintenance' },
            { name: 'Замена воздушного фильтра', category: 'maintenance' },
            { name: 'Замена салонного фильтра', category: 'maintenance' },
            { name: 'Замена свечей зажигания', category: 'maintenance' },
            { name: 'Замена масла в АКПП', category: 'maintenance' },
        ],
    },
    {
        id: 'brakes',
        name: 'Тормозная система',
        jobs: [
            { name: 'Замена тормозной жидкости', category: 'brakes' },
            { name: 'Замена передних тормозных колодок', category: 'brakes' },
            { name: 'Замена задних тормозных колодок', category: 'brakes' },
            { name: 'Замена тормозных дисков', category: 'brakes' },
        ],
    },
    {
        id: 'suspension',
        name: 'Подвеска и рулевое',
        jobs: [
            { name: 'Замена ступичного подшипника', category: 'suspension' },
            { name: 'Замена рулевого наконечника', category: 'suspension' },
            { name: 'Замена шаровой опоры', category: 'suspension' },
            { name: 'Замена стойки стабилизатора', category: 'suspension' },
        ],
    },
    {
        id: 'engine',
        name: 'Двигатель и привод',
        jobs: [
            { name: 'Замена ремня ГРМ', category: 'engine' },
            { name: 'Замена помпы', category: 'engine' },
            { name: 'Устранение течи масла', category: 'engine' },
            { name: 'Чистка дроссельной заслонки', category: 'engine' },
        ],
    },
    {
        id: 'extra',
        name: 'Дополнительные работы',
        jobs: [
            { name: 'Промывка инжектора', category: 'extra' },
            { name: 'Антибактериальная обработка кондиционера', category: 'extra' },
            { name: 'Очиститель топливной системы', category: 'extra' },
            { name: 'Компьютерная диагностика', category: 'extra' },
        ],
    },
];
//# sourceMappingURL=job-catalog.js.map